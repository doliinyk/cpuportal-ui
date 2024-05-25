import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { Processor } from '../../../models/processor.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-processor-card',
  standalone: true,
  imports: [MatCardModule, CurrencyPipe, MatButtonModule, MatDialogModule],
  templateUrl: './processor-card.component.html',
  styleUrl: './processor-card.component.scss',
})
export class ProcessorCardComponent {
  @Input() public processor?: Processor;
  @Input() public isUserProcessorsTab = false;
  @Output() public update = new EventEmitter<Processor>();
  @Output() public delete = new EventEmitter<string>();

  private readonly dialog = inject(MatDialog);

  public onUpdate() {
    this.update.emit(this.processor);
  }

  public onDelete() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Delete processor',
          content: 'Are you sure you want to delete processor?',
        },
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.delete.emit(this.processor?.uuid));
  }
}
