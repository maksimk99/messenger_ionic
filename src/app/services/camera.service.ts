import {Injectable} from '@angular/core';
import {CameraOptions, CameraPhoto, CameraResultType, CameraSource, Plugins} from "@capacitor/core";

const { Camera} = Plugins;

const cameraOptions: CameraOptions = {
  quality: 100,
  resultType: CameraResultType.Uri,
  source: CameraSource.Camera
}

const galleryOptions: CameraOptions = {
  quality: 100,
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

  async takePicture(cameraOptions: CameraOptions): Promise<CameraPhoto> {
    return Camera.getPhoto(cameraOptions);
  }
}
