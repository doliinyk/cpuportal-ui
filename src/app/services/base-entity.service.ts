import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BaseEntity } from '../models/base-entity.model';
import { FilterRequest, Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseEntityService<T extends BaseEntity> {
  protected readonly http = inject(HttpClient);
  protected baseUrl = '/api';

  constructor(baseUrl: string) {
    this.baseUrl += baseUrl;
  }

  public getAll(filterRequest?: FilterRequest) {
    return this.http.get<Page<T>>(this.baseUrl, { params: { ...filterRequest } });
  }

  public add(obj: T) {
    return this.http.post<string>(this.baseUrl, obj);
  }

  public get(uuid: string) {
    return this.http.get<T>(`${this.baseUrl}/${uuid}`);
  }

  public update(uuid: string, obj: T) {
    return this.http.put<void>(`${this.baseUrl}/${uuid}`, obj);
  }

  public delete(uuid: string) {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }
}
