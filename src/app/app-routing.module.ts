import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent} from '../app/dashboard/dashboard.component';
import {SingupComponent} from '../app/singup/singup.component';
import {SinginComponent} from '../app/singin/singin.component';
import {ProfileComponent} from '../app/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Dashboard'
    },
  },
  {
    path: 'login',
    component: SinginComponent,
    data: {
      title: 'Singin'
    },
  },
  {
    path: 'singup',
    component: SingupComponent,
    data: {
      title: 'Singup'
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: 'profile'
    },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
