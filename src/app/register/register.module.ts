import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule, FormsModule,
    NgxIntlTelInputModule,
    RegisterPageRoutingModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
