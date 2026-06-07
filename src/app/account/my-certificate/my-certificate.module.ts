import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCertificatePageRoutingModule } from './my-certificate-routing.module';

import { MyCertificatePage } from './my-certificate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCertificatePageRoutingModule
  ],
  declarations: [MyCertificatePage]
})
export class MyCertificatePageModule {}
