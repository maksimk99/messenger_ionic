import { Injectable } from '@angular/core';
import {CurrentUser} from "../models/current-user.model";
import {CameraPhoto, Capacitor, Device, Filesystem, FilesystemDirectory} from "@capacitor/core";
import {BehaviorSubject, Observable} from "rxjs";
import {SQLiteService} from "./database/sqlite.service";

const GET_CURRENT_USER_SQL = "SELECT * FROM user";
const DELETE_USER_SQL = "DELETE FROM user";
const ADD_NEW_USER_SQL = "INSERT INTO user (name, phone_number, password) VALUES (?, ?, ?)";
const UPDATE_NEW_USER_SQL = "UPDATE user SET name = ?, avatar_url = ?";

const userImageFileName: string = 'userImageFileName.jpeg';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserId;
  private currentUser: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(null);

  constructor(private SQLiteDbService: SQLiteService) {
    this.SQLiteDbService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getCurrentUserFromDB();
      }
    })
  }

  login(loginObject) {
    let currentUser = this.currentUser.value;
    return currentUser && loginObject.phoneNumber === currentUser.phoneNumber &&
        loginObject.password === currentUser.password;
  }

  register(registerObject) {
    this.setCurrentUserInDB(registerObject);
    return true;
  }

  getCurrentUserId() {
    return this.currentUserId;
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.currentUser.asObservable();
  }

  getCurrentUserFromDB() {
    this.SQLiteDbService.query(GET_CURRENT_USER_SQL).then(result => {
      if (result.values.length > 0) {
        let user: CurrentUser = {
          id: result.values[0].id,
          name: result.values[0].name,
          phoneNumber: result.values[0].phone_number,
          avatarUrl: result.values[0].avatar_url ? result.values[0].avatar_url : 'assets/icon/user.png',
          password: result.values[0].password
        }
        this.currentUserId = user.id;
        this.currentUser.next(user)
      }
    })
  }

  setCurrentUserInDB(currentUser) {
    this.SQLiteDbService.run(DELETE_USER_SQL).then(() => {
      this.SQLiteDbService.run(ADD_NEW_USER_SQL,
          [currentUser.userName, currentUser.phoneNumber, currentUser.password]).then(() => {
        this.getCurrentUserFromDB();
      })
    })
  }

  async updateUserInfo(userName: string, cameraPhoto: CameraPhoto) {
    let user = this.currentUser.value;
    if (userName != null && userName.trim().length > 0) {
      user.name = userName;
    }
    if (cameraPhoto != null) {
      user.avatarUrl = await this.updateUserAvatar(cameraPhoto);
    }
    let values: Array<any> = [user.name, user.avatarUrl]
    this.SQLiteDbService.run(UPDATE_NEW_USER_SQL, values).
      then(() => this.getCurrentUserFromDB());
  }

  async updateUserAvatar(cameraPhoto: CameraPhoto) {
    const base64Data = await this.readAsBase64(cameraPhoto);

    await Filesystem.writeFile({
      path: userImageFileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    // Web platform only: Save the photo into the base64 field
    return base64Data;
  }

  async getImageFromFile() {
    const readFile = await Filesystem.readFile({
      path: userImageFileName,
      directory: FilesystemDirectory.Data
    });
    return `data:image/jpeg;base64,${readFile.data}`;
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
