import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { filter } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);
  protected user?: User;
  protected usernameControl?: FormControl;
  protected readonly passwordControl = new FormControl(
    { value: '', disabled: true },
    [Validators.required]
  );

  constructor() {
    this.userService
      .get()
      .pipe(takeUntilDestroyed())
      .subscribe((user) => {
        this.user = user;
        this.usernameControl = new FormControl(
          { value: this.user.username, disabled: true },
          [Validators.required]
        );
      });
  }

  protected onEdit(control: FormControl, property: 'username' | 'password') {
    if (control.disabled) {
      control.enable();
    } else if (control.valid) {
      control.disable();
      if (this.user && control.dirty) {
        this.userService
          .update({ ...this.user, [property]: control.value })
          .pipe(
            filter(() => control.dirty),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe();
      }
    }
  }
}
