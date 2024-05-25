import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Socket } from '../../models/socket.model';
import { SocketService } from '../../services/socket.service';
import { BaseEntityTableComponent } from '../base-entity-table/base-entity-table.component';
import { BaseEntityComponent } from '../base-entity/base-entity.component';

@Component({
  selector: 'app-sockets',
  standalone: true,
  imports: [BaseEntityTableComponent],
  templateUrl: './sockets.component.html',
})
export class SocketsComponent extends BaseEntityComponent<Socket> {
  protected override readonly service = inject(SocketService);
  protected override readonly displayedColumns = ['name'];

  protected override buildControls(
    socket?: Socket
  ): Record<string, FormControl> {
    return {
      uuid: new FormControl(socket?.uuid),
      name: new FormControl(socket?.name, [Validators.required]),
    };
  }
}
