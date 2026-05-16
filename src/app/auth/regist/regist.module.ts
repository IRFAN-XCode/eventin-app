import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistPageRoutingModule } from './regist-routing.module';

import { RegistPage } from './regist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegistPage]
})
export class RegistPageModule { }
