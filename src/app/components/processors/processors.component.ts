import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { map } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProducerService } from '../../services/producer.service';
import { SocketService } from '../../services/socket.service';
import { AllProcessorsComponent } from './all-processors/all-processors.component';
import { UserProcessorsComponent } from './user-processors/user-processors.component';

@Component({
  selector: 'app-processors',
  standalone: true,
  imports: [MatTabsModule, AllProcessorsComponent, UserProcessorsComponent],
  templateUrl: './processors.component.html',
  styleUrl: './processors.component.scss',
})
export class ProcessorsComponent {
  protected readonly authService = inject(AuthService);
  protected readonly producers = inject(ProducerService)
    .getAll({ size: 2e9 })
    .pipe(map((page) => page.content));
  protected readonly sockets = inject(SocketService)
    .getAll({ size: 2e9 })
    .pipe(map((page) => page.content));
}
