import {Injectable} from '@angular/core';
import {CurrentUser} from "../models/current-user.model";
import {CameraPhoto, Capacitor} from "@capacitor/core";
import {BehaviorSubject, Observable} from "rxjs";
import {SQLiteService} from "./database/sqlite.service";
import {FileWriterService} from "./file-writer.service";

const GET_CURRENT_USER_SQL = "SELECT * FROM user";
const DELETE_USER_SQL = "DELETE FROM user";
const ADD_NEW_USER_SQL = "INSERT INTO user (name, phone_number, password) VALUES (?, ?, ?)";
const UPDATE_NEW_USER_SQL = "UPDATE user SET name = ?, avatar_url = ?";

const USER_AVATAR_IMAGE_NAME = 'userImageFileName.jpeg';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserId;
  private currentUser: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(null);

  constructor(private SQLiteDbService: SQLiteService, private fileWriterService: FileWriterService) {
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
      this.fileWriterService.saveTemporaryImage(cameraPhoto.path).then(userAvatarUrl => {
        this.SQLiteDbService.run(UPDATE_NEW_USER_SQL, [user.name, Capacitor.convertFileSrc(userAvatarUrl)]).
        then(() => this.getCurrentUserFromDB());
      });
    } else {
      this.SQLiteDbService.run(UPDATE_NEW_USER_SQL, [user.name, user.avatarUrl]).
      then(() => this.getCurrentUserFromDB());
    }
  }
  //
  // async updateUserAvatar(cameraPhoto: CameraPhoto) {
  //   const readFile =  await Filesystem.readFile({
  //     path: cameraPhoto.path
  //   });
  //
  //   let savedFile = await Filesystem.writeFile({
  //     path: new Date().getTime() + '.jpeg',
  //     data: readFile.data,
  //     directory: FilesystemDirectory.Data
  //   });
  //   return savedFile.uri;
  // }
}
