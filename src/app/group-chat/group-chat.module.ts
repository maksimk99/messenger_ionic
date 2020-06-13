import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupChatPageRoutingModule } from './group-chat-routing.module';

import { GroupChatPage } from './group-chat.page';
import {ContactsPageModule} from "../contacts/contacts.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GroupChatPageRoutingModule,
        ContactsPageModule
    ],
  declarations: [GroupChatPage]
})
export class GroupChatPageModule {}
