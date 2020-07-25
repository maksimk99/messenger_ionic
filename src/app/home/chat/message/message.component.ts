import {Component, Input} from '@angular/core';
import {Message, Participant} from "../../../models/chat.model";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {

  @Input() message: Message;
  @Input() sender: Participant;
  @Input() isGroupChat: boolean;
  @Input() isCurrentUser: boolean;
  @Input() previousMessageSenderId: number;
  @Input() isFirstUnreadMessage: boolean;

  constructor() { }
}
