import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailTicketPageRoutingModule } from './detail-ticket-routing.module';

import { DetailTicketPage } from './detail-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailTicketPageRoutingModule
  ],
  declarations: [DetailTicketPage]
})
export class DetailTicketPageModule {}
