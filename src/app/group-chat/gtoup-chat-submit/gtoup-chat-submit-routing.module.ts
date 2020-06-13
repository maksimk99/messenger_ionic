import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GtoupChatSubmitPage } from './gtoup-chat-submit.page';

const routes: Routes = [
  {
    path: '',
    component: GtoupChatSubmitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GtoupChatSubmitPageRoutingModule {}
