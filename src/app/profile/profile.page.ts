import {Component, OnInit} from '@angular/core';
import {CameraPhoto} from '@capacitor/core';
import {UserService} from "../services/user.service";
import {CurrentUser} from "../models/current-user.model";
import {Router} from "@angular/router";
import {CameraService} from "../services/camera.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: CurrentUser;
  cameraPhoto: CameraPhoto;
  imageUrl: string;
  userName: string;

  constructor(private userService: UserService, private router: Router, private cameraService: CameraService) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => this.user = user);
    this.userName = this.user.userName;
    this.imageUrl = this.user.avatarUrl;
  }

  async takePictureByCamera() {
    this.cameraService.takePictureByCamera().then(image => {
          this.cameraPhoto = image;
          this.imageUrl = image.webPath;
        }
    );
  }

  async takePictureFromGallery() {
    this.cameraService.takePictureFromGallery().then(image => {
          this.cameraPhoto = image;
          this.imageUrl = image.webPath;
        }
    );
  }

  submitChanges() {
    this.userService.updateUserInfo(this.userName, this.cameraPhoto);
    this.router.navigate(['/chats']);
  }
}
