import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FilterRequest, Page } from '../models/page.model';
import { Processor, ProcessorRequest } from '../models/processor.model';
import { HttpParamsBuilder } from './http-params-builder';

@Injectable({
  providedIn: 'root',
})
export class ProcessorService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = '/api/processors';

  public getAll(filterRequest?: FilterRequest) {
    const httpParamsBuilder = new HttpParamsBuilder(filterRequest);

    return this.http.get<Page<Processor>>(this.baseUrl, {
      params: httpParamsBuilder.build(),
    });
  }

  public add(processor: ProcessorRequest) {
    return this.http.post<string>(this.baseUrl, processor);
  }

  public get(uuid: string) {
    return this.http.get<Processor>(`${this.baseUrl}/${uuid}`);
  }
}
