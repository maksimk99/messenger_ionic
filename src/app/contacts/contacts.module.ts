import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactsPageRoutingModule } from './contacts-routing.module';

import { ContactsPage } from './contacts.page';
import {ContactComponent} from "./contact/contact.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ContactsPageRoutingModule
    ],
    exports: [
        ContactComponent
    ],
    declarations: [ContactsPage, ContactComponent]
})
export class ContactsPageModule {}
