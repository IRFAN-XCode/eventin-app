import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCertificatePage } from './my-certificate.page';

const routes: Routes = [
  {
    path: '',
    component: MyCertificatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCertificatePageRoutingModule {}
