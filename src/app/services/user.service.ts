import { Injectable } from '@angular/core';
import {CurrentUser} from "../models/current-user.model";
import {CameraPhoto, Capacitor, Filesystem, FilesystemDirectory} from "@capacitor/core";

const userImageFileName: string = 'userImageFileName.jpeg';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: CurrentUser = {
    id: 'user2',
    name: 'Maksim Koturanov',
    phoneNumber: '+375 (33) 664-87-14',
    avatarUrl: 'https://pickaface.net/gallery/avatar/20151205_194059_2696_Chat.png',
    password: 'password'
  }

  constructor() {
    Filesystem.readFile({
      path: userImageFileName,
      directory: FilesystemDirectory.Data
    }).then(readFile =>
        // Web platform only: Save the photo into the base64 field
        this.currentUser.avatarUrl = `data:image/jpeg;base64,${readFile.data}`
    );
  }

  login(loginObject) {
    console.log('Login object: ' + JSON.stringify(loginObject))
    return false;
  }

  register(registerObject) {
    console.log('Register object: ' + JSON.stringify(registerObject))
    return true;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async updateUserInfo(userName: string, cameraPhoto: CameraPhoto) {
    if (userName != null && userName.trim().length > 0) {
      this.currentUser.name = userName;
    }
    if (cameraPhoto != null) {
      await this.updateUserAvatar(cameraPhoto);
    }
  }

  async updateUserAvatar(cameraPhoto: CameraPhoto) {
    const base64Data = await this.readAsBase64(cameraPhoto);

    await Filesystem.writeFile({
      path: userImageFileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    // Web platform only: Save the photo into the base64 field
    this.currentUser.avatarUrl = `data:image/jpeg;base64,${base64Data}`;
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
