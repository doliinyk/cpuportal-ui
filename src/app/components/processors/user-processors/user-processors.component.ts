import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { PageRequest } from '../../../models/page.model';
import { Processor, ProcessorRequest } from '../../../models/processor.model';
import { Producer } from '../../../models/producer.model';
import { Socket } from '../../../models/socket.model';
import { SnackBarService } from '../../../services/snack-bar.service';
import { UserService } from '../../../services/user.service';
import { AddEditProcessorDialogComponent } from '../add-edit-processor-dialog/add-edit-processor-dialog.component';
import { ProcessorCardComponent } from '../processor-card/processor-card.component';

@Component({
  selector: 'app-user-processors',
  standalone: true,
  imports: [
    AsyncPipe,
    ProcessorCardComponent,
    MatDialogModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  templateUrl: './user-processors.component.html',
  styleUrl: './user-processors.component.scss',
})
export class UserProcessorsComponent {
  @Input() public producers!: Observable<Producer[]>;
  @Input() public sockets!: Observable<Socket[]>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly dialog = inject(MatDialog);
  private readonly pageRequest: PageRequest = {};
  protected processors: Observable<Processor[]> = this.getAllProcessors();
  protected totalElements: number = 0;

  private getAllProcessors() {
    return this.userService.getAllProcessors(this.pageRequest).pipe(
      takeUntilDestroyed(this.destroyRef),
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content;
      })
    );
  }

  public onPageChange(event: PageEvent) {
    this.pageRequest.page = event.pageIndex;
    this.pageRequest.size = event.pageSize;
    this.processors = this.getAllProcessors();
  }

  public onAddUpdate(processor?: Processor) {
    const uuid = processor?.uuid;
    this.dialog
      .open(AddEditProcessorDialogComponent, {
        data: {
          isAdd: !uuid,
          title: `${!uuid ? 'Add ' : 'Edit '} processor`,
          processor,
          producers: this.producers,
          sockets: this.sockets,
        },
        width: '600px',
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        map((data) => {
          if (data.boostClock === false) {
            data.boostClock = null;
          }
          return data;
        }),
        switchMap((processor: ProcessorRequest) =>
          !uuid
            ? this.userService.addProcessor(processor)
            : this.userService.updateProcessor(uuid, processor)
        ),
        tap(() =>
          this.snackBarService.open(
            `Processor has been ${!uuid ? 'added' : 'edited'} successfully`,
            'Close'
          )
        )
      )
      .subscribe(() => (this.processors = this.getAllProcessors()));
  }

  public onDelete(uuid: string) {
    this.userService
      .deleteProcessor(uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => (this.processors = this.getAllProcessors()));
  }
}
