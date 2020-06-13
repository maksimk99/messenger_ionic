import { Injectable } from '@angular/core';
import {CameraOptions, CameraResultType, CameraSource, Plugins} from "@capacitor/core";

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

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  async takePictureByCamera() {
    return this.takePicture(cameraOptions);
  }

  async takePictureFromGallery() {
    return this.takePicture(galleryOptions);
  }

  async takePicture(cameraOptions: CameraOptions) {
    return Plugins.Camera.getPhoto(cameraOptions);
  }
}
