import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Producer } from '../../models/producer.model';
import { ProducerService } from '../../services/producer.service';
import { BaseEntityTableComponent } from '../base-entity-table/base-entity-table.component';
import { BaseEntityComponent } from '../base-entity/base-entity.component';

@Component({
  selector: 'app-producers',
  standalone: true,
  imports: [BaseEntityTableComponent],
  templateUrl: './producers.component.html',
})
export class ProducersComponent extends BaseEntityComponent<Producer> {
  protected override readonly service = inject(ProducerService);
  protected override readonly displayedColumns = ['name', 'description'];

  protected override buildControls(
    producer?: Producer
  ): Record<string, FormControl> {
    return {
      uuid: new FormControl(producer?.uuid),
      name: new FormControl(producer?.name, [Validators.required]),
      description: new FormControl(producer?.description),
    };
  }
}
