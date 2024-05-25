import { Injectable } from '@angular/core';
import { Socket } from '../models/socket.model';
import { BaseEntityService } from './base-entity.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService extends BaseEntityService<Socket> {
  constructor() {
    super('/sockets');
  }
}
