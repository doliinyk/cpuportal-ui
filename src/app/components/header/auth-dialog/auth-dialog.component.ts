import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
})
export class AuthDialogComponent {
  private static isSignUp = true;
  protected readonly dialogRef = inject(MatDialogRef);
  protected title = this.getTitle();
  protected signInUpTitle = this.getSignInUpTitle();
  protected readonly credentialsForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  protected get credentials() {
    return this.credentialsForm.value;
  }

  protected get isSignUp() {
    return AuthDialogComponent.isSignUp;
  }

  public onChangeSignInUp() {
    AuthDialogComponent.isSignUp = !AuthDialogComponent.isSignUp;
    this.title = this.getTitle();
    this.signInUpTitle = this.getSignInUpTitle();
  }

  private getTitle() {
    return AuthDialogComponent.isSignUp ? 'Sign Up' : 'Sign In';
  }

  private getSignInUpTitle() {
    return AuthDialogComponent.isSignUp
      ? 'Have an account? Sign In'
      : "Don't have an account? Sign Up";
  }
}
