import { Injectable } from '@angular/core';
import { Producer } from '../models/producer.model';
import { BaseEntityService } from './base-entity.service';

@Injectable({
  providedIn: 'root',
})
export class ProducerService extends BaseEntityService<Producer> {
  constructor() {
    super('/producers');
  }
}
