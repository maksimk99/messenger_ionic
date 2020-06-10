import {Component, OnInit} from '@angular/core';
import {CameraOptions, CameraPhoto, CameraResultType, CameraSource, Plugins} from '@capacitor/core';
import {UserService} from "../services/user.service";
import {CurrentUser} from "../models/current-user.model";
import {ChatService} from "../services/chat.service";
import {Router} from "@angular/router";

const cameraOptions: CameraOptions = {
  quality: 100,
  allowEditing: false,
  resultType: CameraResultType.Uri,
  source: CameraSource.Camera
}

const galleryOptions: CameraOptions = {
  quality: 100,
  allowEditing: false,
  resultType: CameraResultType.Uri,
  source: CameraSource.Photos
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: CurrentUser;
  cameraPhoto: CameraPhoto;
  userName: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.userName = this.user.name;
  }

  async takePictureByCamera() {
    await this.takePicture(cameraOptions);
  }

  async takePictureFromGallery() {
    await this.takePicture(galleryOptions);
  }

  async takePicture(cameraOptions: CameraOptions) {
    Plugins.Camera.getPhoto(cameraOptions).then(image => {
          this.cameraPhoto = image;
          this.user.avatarUrl = image.webPath;
        }
    );
  }

  submitChanges() {
    this.userService.updateUserInfo(this.userName, this.cameraPhoto);
    this.router.navigate(['/chats']);
  }
}
