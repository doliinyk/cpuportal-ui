import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Page, PageRequest } from '../models/page.model';
import { Processor, ProcessorRequest } from '../models/processor.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/user';

  public get() {
    return this.http.get<User>(this.baseUrl);
  }

  public update(user: User & { password?: string | null }) {
    return this.http.put<void>(this.baseUrl, user);
  }

  public delete() {
    return this.http.delete<void>(this.baseUrl);
  }

  public getAllProcessors(pageRequest?: PageRequest) {
    return this.http.get<Page<Processor>>(`${this.baseUrl}/processors`, {
      params: { ...pageRequest },
    });
  }

  public addProcessor(processor: ProcessorRequest) {
    return this.http.post<string>(`${this.baseUrl}/processors`, processor);
  }

  public updateProcessor(uuid: string, processor: ProcessorRequest) {
    return this.http.put<void>(`${this.baseUrl}/processors/${uuid}`, processor);
  }

  public deleteProcessor(uuid: string) {
    return this.http.delete<void>(`${this.baseUrl}/processors/${uuid}`);
  }
}
