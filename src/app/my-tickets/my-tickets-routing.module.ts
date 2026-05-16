import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyTicketsPage } from './my-tickets.page';

const routes: Routes = [
  {
    path: '',
    component: MyTicketsPage
  },  {
    path: 'detail-ticket',
    loadChildren: () => import('./detail-ticket/detail-ticket.module').then( m => m.DetailTicketPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTicketsPageRoutingModule {}
