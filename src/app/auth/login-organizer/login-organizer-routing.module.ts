import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginOrganizerPage } from './login-organizer.page';

const routes: Routes = [
  {
    path: '',
    component: LoginOrganizerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginOrganizerPageRoutingModule {}
