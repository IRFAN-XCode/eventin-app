import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistOrganizerPageRoutingModule } from './regist-organizer-routing.module';

import { RegistOrganizerPage } from './regist-organizer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistOrganizerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegistOrganizerPage]
})
export class RegistOrganizerPageModule { }
