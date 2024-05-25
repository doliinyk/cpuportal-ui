import { BaseEntity } from './base-entity.model';

export interface Producer extends BaseEntity {
  name: string;
  description?: string;
}
