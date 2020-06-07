import { Injectable } from '@angular/core';
import {ChatPreview} from "../models/chat-preview.model";
import {Chat} from "../models/chat.model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private messageId: number = 11;
  private currentUserId: string = 'user2';
  private chatsPreview: ChatPreview[] = [
    {
      id: 'r1',
      name: 'Alex Stephanov',
      imageUrl: 'https://pickaface.net/gallery/avatar/Shahin_Hanafi5775381770e1f.png',
      unreadMessages: 12,
      lastMessageSenderId: 'user2',
      lastMessageSenderName: 'Maksim Koturanov',
      lastMessageText: 'Ты ж bootstrap хоть немного знаешь, поменяй цвета, оформление таблицы',
      lastMessageDate: new Date(2020, 5, 6, 11, 28, 0, 0),
    },
    {
      id: 'r2',
      name: 'Alex Stephanov',
      imageUrl: 'https://pickaface.net/gallery/avatar/Shahin_Hanafi5775381770e1f.png',
      unreadMessages: 122,
      lastMessageSenderId: 'user1',
      lastMessageSenderName: 'Alex Stephanov',
      lastMessageText: 'А как теперь хоть что-то поменять в 2 и 3 лабе? Мб названия какие-то можно, что-то типо такого',
      lastMessageDate: new Date(2020, 4, 29, 21, 28, 0, 0)
    },
    {
      id: 'r3',
      name: 'Alex Stephanov',
      imageUrl: 'https://pickaface.net/gallery/avatar/Shahin_Hanafi5775381770e1f.png',
      unreadMessages: 2,
      lastMessageSenderId: 'user2',
      lastMessageSenderName: 'Maksim Koturanov',
      lastMessageText: 'Ты ж bootstrap хоть немного знаешь, поменяй цвета, оформление таблицы',
      lastMessageDate: new Date(2020, 5, 6, 11, 28, 0, 0),
    },
    {
      id: 'r4',
      name: 'Alex Stephanov',
      imageUrl: 'https://pickaface.net/gallery/avatar/Shahin_Hanafi5775381770e1f.png',
      unreadMessages: 15,
      lastMessageSenderId: 'user1',
      lastMessageSenderName: 'Alex Stephanov',
      lastMessageText: 'А как теперь хоть что-то поменять в 2 и 3 лабе? Мб названия какие-то можно, что-то типо такого',
      lastMessageDate: new Date(2020, 4, 29, 21, 28, 0, 0)
    }
  ]

  private chat: Chat = {
    id: 'r1',
    name: 'Alex Stephanov',
    avatarUrl: 'https://pickaface.net/gallery/avatar/Shahin_Hanafi5775381770e1f.png',
    participants: [
      {
        id: 'user1',
        name: 'Alex Stephanov',
        avatarUrl: 'https://pickaface.net/gallery/avatar/Shahin_Hanafi5775381770e1f.png'
      },
      {
        id: 'user2',
        name: 'Maksim Koturanov',
        avatarUrl: 'https://pickaface.net/gallery/avatar/20151205_194059_2696_Chat.png'
      }
    ],
    messages: [
      {
        id: 'message1',
        senderId: 'user1',
        message: 'норм, да?',
        time: new Date(2020, 4, 29, 21, 11, 0, 0)
      },
      {
        id: 'message2',
        senderId: 'user2',
        message: 'Это норм, в консоли идеи тоже должно работать, ну да ладно',
        time: new Date(2020, 4, 29, 21, 11, 0, 0)
      },
      {
        id: 'message3',
        senderId: 'user1',
        message: '4 лабу можно вообще не менять да?',
        time: new Date(2020, 4, 29, 21, 12, 0, 0)
      },
      {
        id: 'message4',
        senderId: 'user1',
        message: 'она вроде у всех одинаковая',
        time: new Date(2020, 4, 29, 21, 12, 0, 0)
      },
      {
        id: 'message5',
        senderId: 'user2',
        message: 'Ну да, там только в зависимости от варианта или стек или очередь, но я не думаю что крощенко будет проверять',
        time: new Date(2020, 4, 29, 21, 13, 0, 0)
      },
      {
        id: 'message6',
        senderId: 'user1',
        message: 'А как теперь хоть что-то поменять в 2 и 3 лабе? Мб названия какие-то можно, что-то типо такого',
        time: new Date(2020, 4, 29, 21, 22, 0, 0)
      },
      {
        id: 'message7',
        senderId: 'user2',
        message: 'Ты ж bootstrap хоть немного знаешь, поменяй цвета, оформление таблицы',
        time: new Date(2020, 4, 29, 21, 28, 0, 0)
      },
      {
        id: 'message8',
        senderId: 'user1',
        message: 'а где оно всё находится',
        time: new Date(2020, 4, 29, 21, 38, 0, 0)
      },
      {
        id: 'message9',
        senderId: 'user2',
        message: 'resources/templates',
        time: new Date(2020, 4, 29, 21, 46, 0, 0)
      },
      {
        id: 'message10',
        senderId: 'user2',
        message: 'Вроде так',
        time: new Date(2020, 4, 29, 21, 46, 0, 0)
      }
    ],
    lastReadMessageId: 'message2'
  }

  constructor() { }

  getAllChats() {
    return [...this.chatsPreview];
  }

  getChatById(chatId: string) {
    return {...this.chat};
  }

  sendMessage(vMessage:string) {
    this.chat.messages.push({id: 'message' + this.messageId,senderId: this.currentUserId, time: new Date(), message: vMessage })
    this.messageId++;
    console.log("message is on the way")
  }

  gerCurrentUserId() {
    return this.currentUserId;
  }

  setLastReadMessages(messageId: string) {
    this.chat.lastReadMessageId = messageId;
  }

  findChatWithUserById(userId: string): string {
    //TODO select all dialogs(2 participants) and find one where user with provided id participate in otherwise return null
    return 'r1';
  }

  createChatWithUser(userId: string) {
    //TODO create chat and return generated id
    return 'r1';
  }
}
