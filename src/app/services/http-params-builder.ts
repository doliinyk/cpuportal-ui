import { HttpParams } from '@angular/common/http';
import { FilterRequest } from '../models/page.model';

export class HttpParamsBuilder {
  private httpParams: HttpParams = new HttpParams();

  constructor(filterRequest?: FilterRequest) {
    for (let filter in filterRequest) {
      this.append(filter, filterRequest[filter]);
    }
  }

  public append(
    param: string,
    value?: string | number | boolean | string[] | number[] | boolean[]
  ): this {
    if (value) {
      this.httpParams = this.httpParams.append(
        param,
        Array.isArray(value) ? value.join(',') : value
      );
    }
    return this;
  }

  public build(): HttpParams {
    return this.httpParams;
  }
}
