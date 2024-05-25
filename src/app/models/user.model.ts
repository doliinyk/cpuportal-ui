import { BaseEntity } from './base-entity.model';

export interface User extends BaseEntity {
  username: string;
}
