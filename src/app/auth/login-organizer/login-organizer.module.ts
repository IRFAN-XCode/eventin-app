import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginOrganizerPageRoutingModule } from './login-organizer-routing.module';

import { LoginOrganizerPage } from './login-organizer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginOrganizerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LoginOrganizerPage]
})
export class LoginOrganizerPageModule { }
