import { BaseEntity } from './base-entity.model';

export interface Page<T extends BaseEntity> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: string;
  first: boolean;
  numberOfElements: number;
}

export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export interface FilterRequest extends PageRequest {
  [key: string]: any;
}
