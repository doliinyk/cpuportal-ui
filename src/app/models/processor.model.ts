import { BaseEntity } from './base-entity.model';
import { Producer } from './producer.model';
import { Socket } from './socket.model';

export interface Processor extends BaseEntity {
  producer: Producer;
  model: string;
  socket: Socket;
  cores: number;
  threads: number;
  coreClock: number;
  boostClock?: number;
  graphics: boolean;
  price: number;
}

export interface ProcessorRequest {
  producerId: string;
  model: string;
  socketId: string;
  cores: number;
  threads: number;
  coreClock: number;
  boostClock?: number;
  graphics: boolean;
  price: number;
}
