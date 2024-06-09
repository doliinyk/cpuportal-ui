import { AsyncPipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { Producer } from '../../../models/producer.model';
import { Socket } from '../../../models/socket.model';

@Component({
  selector: 'app-add-edit-processor-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    KeyValuePipe,
    TitleCasePipe,
    MatSelectModule,
    MatOptionModule,
    AsyncPipe,
    MatCheckboxModule,
  ],
  templateUrl: './add-edit-processor-dialog.component.html',
  styleUrl: './add-edit-processor-dialog.component.scss',
})
export class AddEditProcessorDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly data = inject(MAT_DIALOG_DATA);
  protected readonly form = new FormGroup({
    producerId: new FormControl(
      this.data.processor?.producer?.uuid,
      Validators.required
    ),
    model: new FormControl(this.data.processor?.model, Validators.required),
    socketId: new FormControl(
      this.data.processor?.socket?.uuid,
      Validators.required
    ),
    cores: new FormControl(this.data.processor?.cores, Validators.required),
    threads: new FormControl(this.data.processor?.threads, Validators.required),
    coreClock: new FormControl(
      this.data.processor?.coreClock,
      Validators.required
    ),
    boostClock: new FormControl(this.data.processor?.boostClock ?? false),
    graphics: new FormControl(
      this.data.processor?.graphics ?? false,
      Validators.required
    ),
    price: new FormControl(this.data.processor?.price, Validators.required),
  });
  protected readonly producers: Observable<Producer[]> = this.data.producers;
  protected readonly sockets: Observable<Socket[]> = this.data.sockets;
}
