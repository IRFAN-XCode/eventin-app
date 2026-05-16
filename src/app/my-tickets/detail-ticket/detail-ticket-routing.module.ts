import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailTicketPage } from './detail-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: DetailTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailTicketPageRoutingModule {}
