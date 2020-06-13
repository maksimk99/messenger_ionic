import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupChatPage } from './group-chat.page';

const routes: Routes = [
  {
    path: '',
    component: GroupChatPage
  },
  {
    path: 'submit',
    loadChildren: () => import('./gtoup-chat-submit/gtoup-chat-submit.module').then( m => m.GtoupChatSubmitPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupChatPageRoutingModule {}
