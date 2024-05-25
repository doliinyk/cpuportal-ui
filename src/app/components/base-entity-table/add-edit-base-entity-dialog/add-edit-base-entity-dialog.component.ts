import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseEntity } from '../../../models/base-entity.model';

@Component({
  selector: 'app-add-edit-base-entity-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    KeyValuePipe,
    TitleCasePipe,
  ],
  templateUrl: './add-edit-base-entity-dialog.component.html',
  styleUrl: './add-edit-base-entity-dialog.component.scss',
})
export class AddEditBaseEntityDialogComponent<T extends BaseEntity> {
  public readonly form!: FormGroup;
  public readonly title!: string;
  public readonly saveButtonText!: string;
  public readonly cancelButtonText!: string;

  protected readonly dialogRef = inject(MatDialogRef);
  private readonly data = inject(MAT_DIALOG_DATA);

  constructor() {
    this.form = this.data.form;
    this.title = this.data.title;
    this.saveButtonText = this.data.isAdd ? 'Add' : 'Update';
    this.cancelButtonText = 'Cancel';
  }
}
