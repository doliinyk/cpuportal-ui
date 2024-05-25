import { AsyncPipe, TitleCasePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { BaseEntity } from '../../models/base-entity.model';
import { FilterRequest, Page } from '../../models/page.model';
import { AuthService } from '../../services/auth.service';
import { BaseEntityService } from '../../services/base-entity.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AddEditBaseEntityDialogComponent } from './add-edit-base-entity-dialog/add-edit-base-entity-dialog.component';

@Component({
  selector: 'app-base-entity-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    TitleCasePipe,
    ReactiveFormsModule,
    MatPaginatorModule,
    AsyncPipe,
  ],
  providers: [TitleCasePipe],
  templateUrl: './base-entity-table.component.html',
  styleUrl: './base-entity-table.component.scss',
})
export class BaseEntityTableComponent<T extends BaseEntity>
  implements OnInit, AfterViewInit
{
  @ViewChild(MatSort) protected readonly sort!: MatSort;

  @Input() public title!: string;
  @Input() public service!: BaseEntityService<T>;
  @Input() public buildControls!: (entity?: T) => Record<string, FormControl>;
  @Input() public displayedColumns: string[] = [];
  @Input() public dataSource: MatTableDataSource<T> = new MatTableDataSource();
  @Input() public totalElements = new BehaviorSubject(0);
  @Output() public readonly filterChange = new EventEmitter<FilterRequest>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  private readonly titleCasePipe = inject(TitleCasePipe);
  protected readonly authService = inject(AuthService);
  protected readonly filterFormControl = new FormControl('');
  protected readonly snackBarService = inject(SnackBarService);

  public ngOnInit() {
    this.authService.onAuthChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value) {
          this.displayedColumns.push('actions');
        } else {
          this.displayedColumns = this.displayedColumns.filter(
            (column) => column !== 'actions'
          );
        }
      });

    this.service
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((page: Page<T>) => {
        this.dataSource.data = page.content;
        this.totalElements.next(page.totalElements);
      });
  }

  public ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.filterFormControl.valueChanges
      .pipe(
        filter((filter) => filter !== undefined && filter !== null),
        debounceTime(500),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((filter) => this.filterChange.emit({ filter }));
  }

  public onPageChange(event: PageEvent) {
    this.filterChange.emit({
      page: event.pageIndex,
      size: event.pageSize,
    });
  }

  public onAddEdit(entity?: T) {
    let savedEntity: T;
    this.dialog
      .open(AddEditBaseEntityDialogComponent, {
        data: {
          isAdd: !entity,
          form: this.createForm(entity),
          title: `${!entity ? 'Add ' : 'Edit '} ${this.title}`,
        },
        width: '600px',
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap((updatedEntity: T) => {
          savedEntity = updatedEntity;
          return !entity
            ? this.service.add(updatedEntity)
            : this.service.update(updatedEntity.uuid, updatedEntity);
        }),
        map((uuid) => {
          if (!entity && uuid) {
            savedEntity.uuid = uuid;
          }
          return savedEntity;
        }),
        tap(() =>
          this.snackBarService.open(
            this.titleCasePipe.transform(this.title) +
              ' has been ' +
              (!entity ? 'added' : 'edited') +
              ' successfully',
            'Close'
          )
        )
      )
      .subscribe((entity: T) => {
        if (!entity) {
          this.dataSource.data = [...this.dataSource.data, entity];
          return;
        }

        const index = this.dataSource.data.findIndex(
          (e) => e.uuid === entity.uuid
        );
        this.dataSource.data[index] = entity;
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  public onDelete(entity: T) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Delete ' + this.title,
          content: `Are you sure you want to delete this ${this.title}?`,
        },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.service.delete(entity.uuid)),
        takeUntilDestroyed(this.destroyRef),
        tap(() =>
          this.snackBarService.open(
            this.titleCasePipe.transform(this.title) +
              ' has been deleted successfully',
            'Close'
          )
        )
      )
      .subscribe(
        () =>
          (this.dataSource.data = this.dataSource.data.filter(
            (e) => e.uuid !== entity.uuid
          ))
      );
  }

  private createForm(entity?: T): FormGroup {
    return this.fb.group(this.buildControls(entity));
  }
}
