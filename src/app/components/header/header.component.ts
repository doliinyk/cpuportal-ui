import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private redirect?: string;
  protected readonly authService = inject(AuthService);

  public ngOnInit() {
    this.route.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(
          (params) => !!params['login'] && !this.authService.isAuthenticated()
        )
      )
      .subscribe((params) => {
        this.onSignInUp();
        if (params['redirect']) {
          this.redirect = params['redirect'];
        }
      });
  }

  protected onSignInUp() {
    this.dialog
      .open(AuthDialogComponent, { width: '350px', autoFocus: false })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(({ credentials, isSignUp }) =>
          isSignUp
            ? this.authService.register(credentials)
            : this.authService.login(credentials)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.redirect && this.router.navigate([this.redirect]));
  }

  protected onSignOut() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Sign Out',
          content: 'Are you sure you want to sign out?',
        },
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.authService.logout());
  }
}
