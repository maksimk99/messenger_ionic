import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {CurrentUser} from "../models/current-user.model";
import {Router} from "@angular/router";
import {CameraService} from "../services/camera.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ContactsService} from "../services/contacts.service";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: CurrentUser;
  imageUrl: string;
  userName: string;

  constructor(private userService: UserService, private router: Router,
              private cameraService: CameraService, private alertController: AlertController) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => this.user = user);
    this.userName = this.user.userName;
    this.imageUrl = this.user.avatarUrl;
  }

  async takePictureByCamera() {
    this.cameraService.takePictureByCamera().then(image => {
          this.imageUrl = image.webPath;
        }
    );
  }

  async takePictureFromGallery() {
    this.cameraService.takePictureFromGallery().then(image => {
          this.imageUrl = image.webPath;
        }
    );
  }

  submitChanges() {
    this.userService.updateUserPhoto(this.userName === this.user.userName ? null : this.userName,
        this.imageUrl === this.user.avatarUrl ? null : this.imageUrl).then(result => {
        if(result) {
            this.router.navigate(['/chats']);
        } else {
            this.presentAlertCannotSaveImage();
        }
    })
        .catch((err: HttpErrorResponse) => {
            console.log("error: " + JSON.stringify(err))
            this.presentAlertCannotConnectToServer();
        });

  }

    async presentAlertCannotConnectToServer() {
        this.alertController.create({
            header: 'Cannot update user photo',
            message: "<h6>Image size is bigger then server can load</h6>" +
                "<p><i>Please try again using smaller image</i></p>",
            buttons: ['OK']
        }).then(alert => alert.present());
    }

    async presentAlertCannotSaveImage() {
        this.alertController.create({
            header: 'Cannot update user photo',
            message: "<h6>Image size is bigger then server can load</h6>" +
                "<p><i>Please try again using smaller image</i></p>",
            buttons: ['OK']
        }).then(alert => alert.present());
    }
}
