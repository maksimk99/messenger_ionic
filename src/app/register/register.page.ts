import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CountryISO, SearchCountryField, TooltipLabel} from 'ngx-intl-tel-input';
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Belarus, CountryISO.Russia];
  registerForm: FormGroup;

  constructor(private userService: UserService, private alertController: AlertController,
              private router: Router, private formBuilder: FormBuilder) {
    this.registerForm = formBuilder.group({
      phone: ['', Validators.required],
      userName: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(30), Validators.required])]
    })
  }

  ngOnInit() {
  }

  register() {
    let response = this.userService.register(
        {
          phoneNumber: this.registerForm.value.phone.internationalNumber,
          userName: this.registerForm.value.userName,
          password: this.registerForm.value.password
        }
    )
    if (!response) {
      this.presentAlert()
    } else {
      this.router.navigate(['/chats']);
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Cannot register',
      message: "<h6>User with phone number:<br><strong>" +
          this.registerForm.value.phone.internationalNumber +
          "</strong><br>already exists.</h6>" +
          "<p><i>Please use a different phone number.</i></p>",
      buttons: ['OK']
    });

    await alert.present();
  }
}
