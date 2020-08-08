import {Component, OnInit} from '@angular/core';

import {MenuController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {UserService} from "./services/user.service";
import {CurrentUser} from "./models/current-user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  currentUser: CurrentUser;

  constructor(
    private platform: Platform, private splashScreen: SplashScreen,
    private statusBar: StatusBar, private userService: UserService,
    private menuCtrl: MenuController, private router: Router
  ) {
    this.initializeApp();
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {

  }

  logout() {
    this.userService.logout().then(result => {
      if (result) {
        this.menuCtrl.enable(false, 'menuOnHomePage').then(() =>
            this.router.navigate(['/login']));
      }
    });
  }
}
