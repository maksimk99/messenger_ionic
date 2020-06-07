import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ChatService} from "../chat.service";
import {Chat, User} from "./chat.model";
import {IonContent} from "@ionic/angular";
import {Content} from "@angular/compiler/src/render3/r3_ast";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('scrollElement') contentArea: IonContent;
  @ViewChild('scrollList', {read: ElementRef}) chatList: ElementRef;

  chat: Chat;
  currentUserId: string;
  enteredMessage: string = "";
  isCurrentUserSentMessage: boolean = false;

  private mutationObserver: MutationObserver;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private chatService: ChatService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('chatId')) {
        this.router.navigateByUrl('/home');
        return;
      }
      const chatId = paramMap.get('chatId');
      this.chat = this.chatService.getChatById(chatId);
      this.currentUserId = this.chatService.gerCurrentUserId();
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
    let y = document.getElementById('unreadMessages').offsetTop;
    this.contentArea.scrollToPoint(0, y - 9);
  }

  ionViewWillLeave() {
    this.setLastReadMessage(this.chat.messages[this.chat.messages.length - 1].id);
  }

  sendMessage() {
    if (this.enteredMessage.trim().length > 0) {
      this.isCurrentUserSentMessage = true;
      this.chatService.sendMessage(this.enteredMessage);
      this.enteredMessage = "";
    }
  }

  getSenderInfo(senderId: string): User {
    return this.chat.participants.find(participant => participant.id === senderId)
  }

  logScrolling(event) {
    console.log("logScrolling : When Scrolling", event);
  }

  setLastReadMessage(messageId: string) {
    this.chatService.setLastReadMessages(messageId);
  }
}
