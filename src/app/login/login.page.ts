import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CountryISO, SearchCountryField, TooltipLabel} from 'ngx-intl-tel-input';
import {ContactsService} from "../services/contacts.service";
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Belarus, CountryISO.Russia];
  loginForm: FormGroup;

  constructor(private contactsService: ContactsService, private userService: UserService,
              private alertController: AlertController, private router: Router,
              private formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      phone: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(30), Validators.required])]
    })
  }

  ngOnInit() {
  }

  login() {
    let response = this.userService.login(
        {
          phoneNumber: this.loginForm.value.phone.internationalNumber,
          password: this.loginForm.value.password
        }
    )
    if (!response) {
      this.presentAlert()
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Cannot log in',
      message: "<h6>Phone number:<br><strong>" +
          this.loginForm.value.phone.internationalNumber +
          "</strong><br>or password is invalid</h6>" +
          "<p><i>Please try again or press <strong>register</strong> button</i></p>",
      buttons: ['OK']
    });

    await alert.present();
  }
}
