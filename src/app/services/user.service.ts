import {Injectable} from '@angular/core';
import {CurrentUser} from "../models/current-user.model";
import {BehaviorSubject, Observable} from "rxjs";
import {SQLiteService} from "./database/sqlite.service";
import {HttpClient} from "@angular/common/http";
import {LoginUserResponse} from "../models/loginresponse.model";
import {ContactsService} from "./contacts.service";
import {ChatService} from "./chat.service";
import {SQLQuery} from "../properties/SQLQuery"
import {Properties} from "../properties/Properties";
import {WebSocketAPI} from "./rabbitmq/web-socket-a-p-i.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserId;
  private currentUser: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(null);

  constructor(private SQLiteDbService: SQLiteService,
              private httpClient: HttpClient, private contactsService: ContactsService,
              private chatService: ChatService, private webSocketAPI: WebSocketAPI) {
    this.SQLiteDbService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getCurrentUserFromDB();
      }
    })
    this.webSocketAPI.getCurrentUserInfo().subscribe((currentUser: CurrentUser) => {
      if (currentUser !== null) {
        this.SQLiteDbService.run(SQLQuery.UPDATE_CURRENT_USER, [currentUser.userName, currentUser.avatarUrl,
          this.currentUserId]).then(() => {this.getCurrentUserFromDB();});
      }
    });
  }

  login(loginObject) {
    return this.httpClient.post<LoginUserResponse>(Properties.BASE_URL + "/login", loginObject).toPromise().then(async (user: LoginUserResponse) => {
      if (user !== null) {
        await this.setCurrentUserInDB(user);
        return this.contactsService.saveContactListToDatabase(user.contacts).then(result =>
            this.chatService.saveChatListToDatabase(user.chats, user.userId).then(result => {
                  this.webSocketAPI.connect(user.userId);
                  return true;
            }));
      } else {
        return false;
      }
    });
  }

  register(registerObject) {
    return this.httpClient.post<number>(Properties.BASE_URL + "/register", registerObject).toPromise().then(async (userId: number) => {
      if (userId !== null) {
        let currentUser: CurrentUser = {
          userId: userId,
          userName: registerObject.userName,
          phoneNumber: registerObject.phoneNumber,
          avatarUrl: null,
          password: registerObject.password
        }
        registerObject.userId = userId;
        await this.setCurrentUserInDB(currentUser);
        this.webSocketAPI.connect(userId);
        return true
      } else {
        return false;
      }
    })
  }

  logout() {
    this.webSocketAPI.disconnect();
    this.chatService.clearData();
    this.contactsService.clearData();
    this.currentUserId = null;
    this.currentUser.next(null);
    return this.SQLiteDbService.isDBExists(Properties.DB_NAME).then(result => {
      if (result) {
        return this.SQLiteDbService.deleteDB().then(() => this.SQLiteDbService.createDB().then(() => true))
      } else  {
        return this.SQLiteDbService.createDB().then(() => true)
      }
    })
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
        this.chatService.setCurrentUserId(user.userId)
        this.currentUser.next(user)
      }
    })
  }

  async setCurrentUserInDB(currentUser: CurrentUser) {
    await this.SQLiteDbService.run(SQLQuery.SAVE_CURRENT_USER,
          [currentUser.userId, currentUser.userName, currentUser.phoneNumber, currentUser.avatarUrl,
            currentUser.password]).then(() => {
        this.getCurrentUserFromDB();
      });
  }

  async updateUserPhoto(userName: string, imageWebPath: string) {
    const formData = new FormData();
    if (imageWebPath) {
      const blob = await fetch(imageWebPath).then(r => r.blob());
      formData.append('file', blob, 'file.jpg');
    }
    if (userName) {
      formData.append("userName", userName);
    }
    return this.httpClient.post<any>(Properties.BASE_URL + `/user/${this.currentUserId}/avatar/update`, formData)
        .toPromise().then(user => {
          return !!user;
        });
  }
}
