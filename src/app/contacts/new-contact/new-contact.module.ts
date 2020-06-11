import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { NewContactPageRoutingModule } from './new-contact-routing.module';
import { NewContactPage } from './new-contact.page';
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, IonicModule,
        ReactiveFormsModule, FormsModule,
        NgxIntlTelInputModule,
        NewContactPageRoutingModule
    ],
  declarations: [NewContactPage]
})
export class NewContactPageModule {}
