import {Injectable} from '@angular/core';
import {ChatPreview} from "../models/chat-preview.model";
import {Chat, Message, Participant} from "../models/chat.model";
import {Contact} from "../models/contact.model";
import {BehaviorSubject} from "rxjs";
import {SQLiteService} from "./database/sqlite.service";
import {CameraPhoto, Capacitor} from "@capacitor/core";
import {FileWriterService} from "./file-writer.service";
import {ChatDTO} from "../models/loginresponse.model";
import {SQLQuery} from "../properties/SQLQuery"
import {HttpClient} from "@angular/common/http";
import {Properties} from "../properties/Properties";
import {WebSocketAPI} from "./rabbitmq/web-socket-a-p-i.service";
import {MessageDTO} from "../models/message.model";
import {NewChatDTO} from "../models/chat-dto.model";
import {ContactsService} from "./contacts.service";

const DEFAULT_CHAT: Chat = {
  chatId: -5,
  chatName: 'undefined',
  avatarUrl: 'assets/icon/group.png',
  lastReadMessageId: 1,
  participants: [],
  messages: []
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private currentUserId: number;
  private chatsPreviewList: BehaviorSubject<ChatPreview[]> = new BehaviorSubject<ChatPreview[]>([]);
  private currentChat: BehaviorSubject<Chat> = new BehaviorSubject<Chat>(DEFAULT_CHAT);
  private chatInProcessOfCreation: ChatDTO = null;

  constructor(private SQLiteDbService: SQLiteService, private httpClient: HttpClient,
              private fileWriterService: FileWriterService, private webSocketAPI: WebSocketAPI,
              private contactsService: ContactsService) {
    this.SQLiteDbService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getChatPreviewsFromDB();
      }
    });
    this.webSocketAPI.getMessages().subscribe((message: MessageDTO) => {
      if (message !== null) {
        this.saveMessage(message.chatId, message.senderId, new Date(message.dateSent), message.message);
      }
    });
    this.webSocketAPI.getNewGroup().subscribe((chat: NewChatDTO) => {
      if (chat !== null && chat.chatName !== this.chatInProcessOfCreation?.chatName
          && chat.participants.length !== this.chatInProcessOfCreation?.members.length
          && !this.chatsPreviewList.value.find(chatPreview => chatPreview.id === chat.chatId)) {
        let membersId: number[] = chat.participants.map(member => member.contactId);
        let chatDTO: ChatDTO = {
          chatId: chat.chatId,
          chatName: chat.chatName,
          avatarUrl: chat.avatarUrl,
          members: membersId
        }
        this.contactsService.saveContactsOfNewChat(chat.participants, this.currentUserId).then(result => {
              this.saveChatToDatabase(chatDTO, this.currentUserId).then(() =>
                  this.getChatPreviewsFromDB())
            });
      }
    })
  }

  setCurrentUserId(currentUserId: number) {
    this.currentUserId = currentUserId;
  }

  getChatPreviewsFromDB() {
    this.SQLiteDbService.query(SQLQuery.CHAT_PREVIEW_LIST).then(result => {
      let items: ChatPreview[] = [];
      if (result.values.length > 0) {
        for (let i = 0; i < result.values.length; i++) {
          let chatPreview: ChatPreview = {
            id: result.values[i].id,
            name: result.values[i].name,
            imageUrl: result.values[i].avatar_url,
            unreadMessages: result.values[i].unread_messages,
            lastMessageSenderName: !result.values[i].last_message_sender_name && result.values[i].last_message_text
                ? 'Me' : result.values[i].last_message_sender_name,
            lastMessageText: result.values[i].last_message_text,
            lastMessageDate: !result.values[i].last_message_date ? null : new Date(result.values[i].last_message_date)
          };
          items.push(chatPreview);
        }
      }
      this.chatsPreviewList.next(items)
    })
  }

  getChatByIdFromDB(chatId: number) {
    this.SQLiteDbService.query(SQLQuery.CHAT_BY_ID, [chatId.toString()]).then(result => {
        let chat: Chat = {
          chatId: result.values[0].chatId,
          chatName: result.values[0].chatName,
          avatarUrl: result.values[0].chatAvatar,
          lastReadMessageId: result.values[0].last_read_message_id,
          participants: [],
          messages: []
        }
        let isFirstMessage = true;
        let lastMessageId = result.values[0].messageId;
        if(result.values[0].messageId) {
          chat.messages.push(this.createMessage(result.values[0]));
        }
        for (let i = 0; i < result.values.length; i++) {
          if(lastMessageId !== result.values[i].messageId) {
            isFirstMessage = false;
            lastMessageId = result.values[i].messageId;
            chat.messages.push(this.createMessage(result.values[i]));
          }
          if(isFirstMessage) {
            chat.participants.push(this.createParticipant(result.values[i]));

          }
        }
      this.currentChat.next(chat);
    });
  }

  createParticipant(values): Participant {
    return {
      participantId: values.participantId,
      participantName: values.participantName,
      avatarUrl: values.participantAvatar
    }
  }

  createMessage(values): Message {
    return {
      messageId: values.messageId,
      message: values.message,
      senderId: !values.sender_id ? null : values.sender_id,
      time: new Date(values.date_sent)
    }
  }

  getAllChats() {
    return this.chatsPreviewList.asObservable();
  }

  getChatById(chatId: number) {
    if (chatId != this.currentChat.value.chatId) {
      this.getChatByIdFromDB(chatId)
    }
    return this.currentChat.asObservable();
  }

  findChatsByName(name: string) {
    return this.chatsPreviewList.value.filter(chatPreview => chatPreview.name.toLowerCase().match("^" + name.toLowerCase() + ".*"));
  }

  sendMessage(vMessage:string, chatId: number, currentUserId: number) {
    let message: MessageDTO = {
      message: vMessage,
      senderId: currentUserId,
      chatId: chatId,
      dateSent: new Date()
    }
    return this.webSocketAPI.send(message);
  }

  saveMessage(chatId: number, senderId: number, date_sent: Date, message: string) {
    this.SQLiteDbService.run(SQLQuery.ADD_MESSAGE, [message, date_sent, chatId, senderId]).then(result => {
          if (!senderId) {
            this.SQLiteDbService.run(SQLQuery.UPDATE_LAST_READ_MESSAGE_IN_CHAT_BY_ID,
                [result.changes.lastId, chatId]);
          }
          if (chatId === this.currentChat.value.chatId) {
            this.getChatByIdFromDB(chatId);
          }
          this.SQLiteDbService.run(SQLQuery.UPDATE_LAST_MESSAGE_IN_CHAT_BY_ID,
              [result.changes.lastId, chatId]).then(result => this.getChatPreviewsFromDB());
    });
  }

  setLastReadMessages(messageId: number, chatId: number) {
    this.SQLiteDbService.run(SQLQuery.UPDATE_LAST_READ_MESSAGE_IN_CHAT_BY_ID, [messageId, chatId]).then(() => {
          if (chatId === this.currentChat.value.chatId) {
            this.getChatByIdFromDB(chatId);
          }
          this.getChatPreviewsFromDB();
    });
  }

  findChatWithUserById(userId: number): Promise<number> {
    return this.SQLiteDbService.query(SQLQuery.CHAT_PREVIEW_LIST_BY_NAME, [userId.toString()]).then(result => {
            return result.values.length === 1 ? result.values[0].id : null;
    })
  }

  createChatWithUser(contact: Contact, currentUserId: number) {
    //TODO create chat and return generated id
    return this.createNewGroup([contact], 'dialog', null, currentUserId)
  }

  async clearData() {
    this.currentUserId = null;
    this.chatsPreviewList = new BehaviorSubject<ChatPreview[]>([]);
    this.currentChat = new BehaviorSubject<Chat>(DEFAULT_CHAT);
  }

  async createNewGroup(members: Contact[], groupName: string, groupImage: CameraPhoto, currentUserId: number) {
    let membersId: number[] = members.map(member => member.contactId);
    membersId.push(currentUserId)
    let groupImageUrl = null;
    if (groupImage) {
      groupImageUrl = Capacitor.convertFileSrc(await this.fileWriterService.saveTemporaryImage(groupImage.path));
    }
    let chatDTO: ChatDTO = {
      chatId: null,
      chatName: groupName,
      avatarUrl: groupImageUrl,
      members: membersId
    }
    this.chatInProcessOfCreation = chatDTO;
    return await this.httpClient.post<number>(Properties.BASE_URL + "/chat/create", chatDTO).toPromise().then((chatId: number) => {
      if (chatId !== null) {
        chatDTO.chatId = chatId;
        return this.saveChatToDatabase(chatDTO, currentUserId).then((result) => {
          this.getChatPreviewsFromDB();
          this.chatInProcessOfCreation = null;
          return result;
        })
      } else {
        this.chatInProcessOfCreation = null;
        return null;
      }
    });
  }

  async saveChatListToDatabase(chats: ChatDTO[], currentUserId: number) {
    let number = 0;
    for(let i = 0; i < chats.length; i++) {
      number += 1;
      await this.saveChatToDatabase(chats[i], currentUserId)
    }
    this.getChatPreviewsFromDB();
    return number;
  }

  async saveChatToDatabase(chat: ChatDTO, currentUserId: number) {
    let number = 0;
    await this.SQLiteDbService.run(SQLQuery.ADD_CHAT, [chat.chatId, chat.chatName, chat.avatarUrl]);
    for(let i = 0; i < chat.members.length; i++) {
      if (chat.members[i] !== currentUserId) {
        number += 1;
        await this.SQLiteDbService.run(SQLQuery.ADD_MEMBER_TO_CHAT, [chat.chatId, chat.members[i]]);
      }
    }
    return chat.chatId;
  }
}
