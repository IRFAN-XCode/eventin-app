import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistPage } from './regist.page';

const routes: Routes = [
  {
    path: '',
    component: RegistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistPageRoutingModule {}
