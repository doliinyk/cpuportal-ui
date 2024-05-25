import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { FilterRequest } from '../../../models/page.model';
import { Processor } from '../../../models/processor.model';
import { Producer } from '../../../models/producer.model';
import { Socket } from '../../../models/socket.model';
import { ProcessorService } from '../../../services/processor.service';
import { ProcessorCardComponent } from '../processor-card/processor-card.component';

@Component({
  selector: 'app-all-processors',
  standalone: true,
  imports: [
    AsyncPipe,
    ProcessorCardComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatCheckboxModule,
  ],
  templateUrl: './all-processors.component.html',
  styleUrl: './all-processors.component.scss',
})
export class AllProcessorsComponent {
  @Input() public producers!: Observable<Producer[]>;
  @Input() public sockets!: Observable<Socket[]>;

  public readonly filter: FilterRequest = { sort: 'price,desc' };
  private readonly processorService = inject(ProcessorService);
  private filtersSubject = new BehaviorSubject<FilterRequest>(this.filter);
  protected readonly processors: Observable<Processor[]> = this.filtersSubject
    .asObservable()
    .pipe(
      takeUntilDestroyed(),
      switchMap((filters) =>
        this.processorService.getAll(filters).pipe(
          map((page) => {
            this.totalElements = page.totalElements;
            return page.content;
          })
        )
      )
    );

  protected totalElements: number = 0;

  public applyFilter() {
    this.filtersSubject.next(this.filter);
  }

  public onSortChange(event: MatSelectChange) {
    this.filter.sort = `price,${event.value}`;
  }

  public onPageChange(event: PageEvent) {
    this.filter.page = event.pageIndex;
    this.filter.size = event.pageSize;
    this.applyFilter();
  }
}
