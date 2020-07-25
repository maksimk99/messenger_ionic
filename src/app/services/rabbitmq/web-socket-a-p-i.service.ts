import {Injectable} from "@angular/core";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {MessageDTO} from "../../models/message.model";
import {Properties} from "../../properties/Properties";
import {BehaviorSubject} from "rxjs";
import {NewChatDTO} from "../../models/chat-dto.model";
import {Contact} from "../../models/contact.model";

@Injectable({
  providedIn: 'root'
})
export class WebSocketAPI {

  stompClient: any;
  currentUserId: number;
  obtainedMessage: BehaviorSubject<MessageDTO> = new BehaviorSubject<MessageDTO>(null);
  obtainedChat: BehaviorSubject<NewChatDTO> = new BehaviorSubject<NewChatDTO>(null);
  subscription: any;
  isConnected: boolean = false;

  constructor() {
  }

  connect(userId: number) {
    if (!this.isConnected) {
      let headers = {
        login: 'guest',
        passcode: 'guest',
        'client-id': userId
      };
      this.currentUserId = userId;
      let ws = new SockJS(Properties.WEB_SOCKET_ENDPOINT);
      let vStompClient = Stomp.over(ws);
      this.stompClient = vStompClient;
      let _this = this;
      vStompClient.connect(headers, function (frame) {
        _this.subscription = vStompClient.subscribe("/exchange/userExchange" + _this.currentUserId, function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
        }, {"x-queue-name": "userQueue" + _this.currentUserId, "durable": true, "auto-delete": false});
        _this.isConnected = true;
      }, this.errorCallBack);
    }
  };

  disconnect() {
    if (this.isConnected) {
      this.subscription.unsubscribe()
      this.stompClient.disconnect(function (disconnect) {
      });
      this.isConnected = false;
    }
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect(this.currentUserId);
    }, 5000);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message
   */
  send(message: MessageDTO) {
    if (this.isConnected) {
      this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
      return true;
    } else {
       return false;
    }
  }

  onMessageReceived(vMessage) {
    if (vMessage.headers.messageType === "chat") {
      let newChat: NewChatDTO = JSON.parse(vMessage.body);
      this.obtainedChat.next(newChat)
    } else {
      let message: MessageDTO = JSON.parse(vMessage.body);
      if (message.senderId === this.currentUserId) {
        message.senderId = null;
      }
      this.obtainedMessage.next(message);
    }
  }

  getMessages() {
    return this.obtainedMessage.asObservable();
  }

  getNewGroup() {
    return this.obtainedChat.asObservable();
  }
}
