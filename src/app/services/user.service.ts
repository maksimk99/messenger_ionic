import {Injectable} from '@angular/core';
import {CurrentUser} from "../models/current-user.model";
import {CameraPhoto, Capacitor} from "@capacitor/core";
import {BehaviorSubject, Observable} from "rxjs";
import {SQLiteService} from "./database/sqlite.service";
import {FileWriterService} from "./file-writer.service";
import {HttpClient} from "@angular/common/http";
import {LoginUserResponse} from "../models/loginresponse.model";
import {ContactsService} from "./contacts.service";
import {ChatService} from "./chat.service";
import {SQLQuery} from "../properties/SQLQuery"
import {Properties} from "../properties/Properties";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserId;
  private currentUser: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(null);

  constructor(private SQLiteDbService: SQLiteService, private fileWriterService: FileWriterService,
              private httpClient: HttpClient, private contactsService: ContactsService, private chatService: ChatService) {
    this.SQLiteDbService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getCurrentUserFromDB();
      }
    })
  }

  login(loginObject) {
    return this.httpClient.post<LoginUserResponse>(Properties.BASE_URL + "/login", loginObject).toPromise().then((user: LoginUserResponse) => {
      if (user !== null) {
        this.setCurrentUserInDB(user);
        this.contactsService.saveContactListToDatabase(user.contacts).then(() =>
            this.chatService.saveChatListToDatabase(user.chats, user.userId));
        return true;
      } else {
        return false;
      }
    });
  }

  register(registerObject) {
    return this.httpClient.post<number>(Properties.BASE_URL + "/register", registerObject).toPromise().then((userId: number) => {
      if (userId !== null) {
        registerObject.id = userId;
        this.setCurrentUserInDB(registerObject);
        return true
      } else {
        return false;
      }
    })
  }

  logout() {
    return this.SQLiteDbService.run(SQLQuery.LOGOUT_USER);
  }

  getCurrentUserId() {
    return this.currentUserId;
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.currentUser.asObservable();
  }

  getCurrentUserFromDB() {
    this.SQLiteDbService.query(SQLQuery.GET_CURRENT_USER).then(result => {
      if (result.values.length > 0) {
        let user: CurrentUser = {
          userId: result.values[0].id,
          userName: result.values[0].name,
          phoneNumber: result.values[0].phone_number,
          avatarUrl: result.values[0].avatar_url ? result.values[0].avatar_url : 'assets/icon/user.png',
          password: result.values[0].password
        }
        this.currentUserId = user.userId;
        this.currentUser.next(user)
      }
    })
  }

  setCurrentUserInDB(currentUser: CurrentUser) {
    this.SQLiteDbService.run(SQLQuery.DELETE_USER).then(() => {
      this.SQLiteDbService.run(SQLQuery.ADD_NEW_USER,
          [currentUser.userId, currentUser.userName, currentUser.phoneNumber, currentUser.avatarUrl,
            currentUser.password]).then(() => {
        this.getCurrentUserFromDB();
      })
    })
  }

  async updateUserInfo(userName: string, cameraPhoto: CameraPhoto) {
    let user = this.currentUser.value;
    if (userName != null && userName.trim().length > 0) {
      user.userName = userName;
    }
    if (cameraPhoto != null) {
      this.fileWriterService.saveTemporaryImage(cameraPhoto.path).then(userAvatarUrl => {
        this.SQLiteDbService.run(SQLQuery.UPDATE_NEW_USER, [user.userName, Capacitor.convertFileSrc(userAvatarUrl)]).
        then(() => this.getCurrentUserFromDB());
      });
    } else {
      this.SQLiteDbService.run(SQLQuery.UPDATE_NEW_USER, [user.userName, user.avatarUrl]).
      then(() => this.getCurrentUserFromDB());
    }
  }
}
