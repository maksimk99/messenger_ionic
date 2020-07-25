import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ChatService} from "../../services/chat.service";
import {Chat, Participant} from "../../models/chat.model";
import {IonContent} from "@ionic/angular";
import {UserService} from "../../services/user.service";
import {CurrentUser} from "../../models/current-user.model";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('scrollElement') contentArea: IonContent;
  @ViewChild('scrollList', {read: ElementRef}) chatList: ElementRef;

  chat: Chat;
  currentUser: CurrentUser;
  enteredMessage: string = "";
  isCurrentUserSentMessage: boolean = false;

  private mutationObserver: MutationObserver;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private chatService: ChatService,
              private userService: UserService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('chatId')) {
        this.router.navigateByUrl('/home');
        return;
      }
      const chatId = paramMap.get('chatId');
      this.chatService.getChatById(parseInt(chatId)).subscribe(chat => {
        this.chat = chat;
      });
      this.userService.getCurrentUser().subscribe(user => this.currentUser = user);
    })
  }

  ionViewWillEnter(){
    this.mutationObserver = new MutationObserver((mutations) => {
      if (this.isCurrentUserSentMessage) {
        this.contentArea.scrollToBottom();
        this.isCurrentUserSentMessage = false;
      }
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
    });
  }

  ionViewDidEnter() {
      let y = document.getElementById('unreadMessages')?.offsetTop;
      if(y) {
        this.contentArea.scrollToPoint(0, y - 9);
      } else {
        this.contentArea.scrollToBottom();
      }
  }

  ionViewWillLeave() {
    if (this.chat.messages.length > 0) {
      this.setLastReadMessage(this.chat.messages[this.chat.messages.length - 1].messageId);
    }
  }

  sendMessage() {
    if (this.enteredMessage.trim().length > 0) {
      this.isCurrentUserSentMessage = true;
      this.chatService.sendMessage(this.enteredMessage, this.chat.chatId, this.currentUser.userId);
      this.enteredMessage = "";
    }
  }

  getSenderInfo(senderId: number): Participant {
    if (!senderId) {
      return {
        participantId: this.currentUser.userId,
        participantName: this.currentUser.userName,
        avatarUrl: this.currentUser.avatarUrl
      };
    } else {
      return this.chat.participants.find(participant => participant.participantId === senderId)
    }
  }

  logScrolling(event) {
    console.log("logScrolling: When Scrolling", event);
  }

  setLastReadMessage(messageId: number) {
    this.chatService.setLastReadMessages(messageId, this.chat.chatId);
  }
}
