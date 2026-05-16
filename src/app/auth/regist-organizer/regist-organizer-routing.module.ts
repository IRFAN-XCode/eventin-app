import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistOrganizerPage } from './regist-organizer.page';

const routes: Routes = [
  {
    path: '',
    component: RegistOrganizerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistOrganizerPageRoutingModule {}
