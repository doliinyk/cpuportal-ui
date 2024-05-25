import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ProcessorsComponent } from './components/processors/processors.component';
import { ProducersComponent } from './components/producers/producers.component';
import { ProfileComponent } from './components/profile/profile.component';
import { profileGuard } from './components/profile/profile.guard';
import { SocketsComponent } from './components/sockets/sockets.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'producers',
    component: ProducersComponent,
  },
  {
    path: 'sockets',
    component: SocketsComponent,
  },
  {
    path: 'processors',
    component: ProcessorsComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [profileGuard],
  },
];
