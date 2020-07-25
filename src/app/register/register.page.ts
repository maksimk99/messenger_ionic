import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountryISO, SearchCountryField, TooltipLabel} from 'ngx-intl-tel-input';
import {AlertController, MenuController} from "@ionic/angular";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";

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
              private router: Router, private formBuilder: FormBuilder, private menuCtrl: MenuController) {
    this.registerForm = formBuilder.group({
      phone: ['', Validators.required],
      userName: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(30), Validators.required])]
    })
  }

  ngOnInit() {
    this.menuCtrl.enable(false, 'menuOnHomePage');
  }

  register() {
    this.userService.register(
        {
          phoneNumber: this.registerForm.value.phone.internationalNumber,
          userName: this.registerForm.value.userName,
          password: this.registerForm.value.password
        }
    ).then(userId => {
      if (userId) {
        this.menuCtrl.enable(true, 'menuOnHomePage').then(() =>
            this.router.navigate(['/chats']));
      } else {
        this.presentAlert()
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
