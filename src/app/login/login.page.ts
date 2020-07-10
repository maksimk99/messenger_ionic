import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CountryISO, SearchCountryField, TooltipLabel} from 'ngx-intl-tel-input';
import {AlertController, MenuController} from "@ionic/angular";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {CurrentUser} from "../models/current-user.model";
import {HttpErrorResponse} from "@angular/common/http";

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

  constructor(private userService: UserService, private alertController: AlertController,
              private router: Router, private formBuilder: FormBuilder, private menuCtrl: MenuController) {
    this.loginForm = formBuilder.group({
      phone: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(30), Validators.required])]
    })
  }

  ngOnInit() {
    this.menuCtrl.enable(false, 'menuOnHomePage');
    this.userService.getCurrentUser().subscribe(user => {
      if (user !== null) {
        this.menuCtrl.enable(true, 'menuOnHomePage').then(() =>
            this.router.navigate(['/chats']));
      }
    });
  }

  login() {
    this.userService.login(
        {
          phoneNumber: this.loginForm.value.phone.internationalNumber,
          password: this.loginForm.value.password
        }
    ).then(response => {
      if (!response) {
        this.presentAlert()
      } else {
        this.menuCtrl.enable(true, 'menuOnHomePage').then(() =>
            this.router.navigate(['/chats']));
      }
    }).catch((err: HttpErrorResponse) => {
      this.alertController.create({
        header: 'Connection failed',
        message: "<h6>Cannot connect to the server</h6>" +
            "<p><i>Please check your internet connection and try again.</i></p>",
        buttons: ['OK']
      }).then(alert => alert.present());
    });
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
