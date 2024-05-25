import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { BaseEntity } from '../../models/base-entity.model';
import { FilterRequest } from '../../models/page.model';
import { BaseEntityService } from '../../services/base-entity.service';

@Component({
  selector: 'app-base-entity',
  template: '',
})
export abstract class BaseEntityComponent<T extends BaseEntity> {
  protected readonly destroyRef = inject(DestroyRef);
  protected abstract readonly service: BaseEntityService<T>;
  protected abstract readonly displayedColumns: string[];
  protected readonly dataSource = new MatTableDataSource<T>();
  protected readonly totalElements = new BehaviorSubject(0);

  protected abstract buildControls(entity?: T): Record<string, FormControl>;

  protected onFilterChange(filter: FilterRequest) {
    this.service
      .getAll(filter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((entities) => {
        this.dataSource.data = entities.content;
        this.totalElements.next(entities.totalElements);
      });
  }
}
