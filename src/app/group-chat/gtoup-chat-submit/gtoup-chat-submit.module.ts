import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GtoupChatSubmitPageRoutingModule } from './gtoup-chat-submit-routing.module';

import { GtoupChatSubmitPage } from './gtoup-chat-submit.page';
import {ContactsPageModule} from "../../contacts/contacts.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GtoupChatSubmitPageRoutingModule,
        ContactsPageModule
    ],
  declarations: [GtoupChatSubmitPage]
})
export class GtoupChatSubmitPageModule {}
