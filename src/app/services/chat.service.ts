import {Injectable} from '@angular/core';
import {ChatPreview} from "../models/chat-preview.model";
import {Chat, Message, User} from "../models/chat.model";
import {UserService} from "./user.service";
import {Contact} from "../models/contact.model";
import {BehaviorSubject} from "rxjs";
import {SQLiteService} from "./database/sqlite.service";

const CHAT_PREVIEW_LIST_SQL = "SELECT chats_preview.*, COUNT(msg.id) as unread_messages FROM" +
    "  (SELECT ch.id, " +
    "          CASE COUNT(partisipant.id) WHEN 1 THEN GROUP_CONCAT(partisipant.name) ELSE ch.name END name, " +
    "          CASE COUNT(partisipant.id) WHEN 1 THEN GROUP_CONCAT(partisipant.avatar_url) ELSE ch.avatar_url END avatar_url, " +
    "     ch.last_read_message_id, m.message as last_message_text, m.date_sent as last_message_date," +
    "     c.name as last_message_sender_name FROM chat as ch" +
    "   LEFT JOIN message as m ON ch.last_message_id = m.id" +
    "   LEFT JOIN contact as c ON m.sender_id = c.id" +
    "   LEFT JOIN chat_has_contacts as chc ON ch.id = chc.chat_id" +
    "   LEFT JOIN contact as partisipant ON chc.contact_id = partisipant.id" +
    "   GROUP BY ch.id) as chats_preview" +
    " LEFT JOIN message as msg ON chats_preview.id = msg.chat_id AND msg.date_sent > (SELECT date_sent FROM message WHERE id = chats_preview.last_read_message_id)" +
    " GROUP BY chats_preview.id ";

const CHAT_PREVIEW_LIST_BY_NAME_SQL = "SELECT ch.id FROM chat as ch\n" +
    "         JOIN chat_has_contacts as chc ON ch.id = chc.chat_id\n" +
    "         GROUP BY ch.id\n" +
    "         HAVING COUNT(chc.contact_id) = 1 AND GROUP_CONCAT(chc.contact_id) = ?";

const CHAT_BY_ID_SQL = "SELECT ch.id as chatId, ch.name as chatName, ch.avatar_url as chatAvatar, " +
    "ch.last_read_message_id, c.id as participantId, c.name as participantName, c.avatar_url as participantAvatar, " +
    "m.id as messageId, m.message, m.sender_id, m.date_sent FROM chat as ch\n" +
    " JOIN chat_has_contacts chc ON ch.id = chc.chat_id\n" +
    " JOIN contact c ON chc.contact_id = c.id \n" +
    " LEFT JOIN message m ON ch.id = m.chat_id\n" +
    " WHERE ch.id = ? ORDER BY m.date_sent, m.id ";

const ADD_CHAT_SQL = "INSERT INTO chat (name, avatar_url) VALUES (?, ?)";
const ADD_MEMBER_TO_CHAT_SQL = "INSERT INTO chat_has_contacts (chat_id, contact_id) VALUES (?, ?)";
const ADD_MESSAGE_SQL = "INSERT INTO message (message, date_sent, chat_id, sender_id) VALUES ( ?, ?, ?, ?)";
const UPDATE_LAST_READ_MESSAGE_IN_CHAT_BY_ID_SQL = "UPDATE chat SET last_read_message_id = ? WHERE id = ?";
const UPDATE_LAST_MESSAGE_IN_CHAT_BY_ID_SQL = "UPDATE chat SET last_message_id = ? WHERE id = ?";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private messageId: number = 11;
  private chatsPreviewList: BehaviorSubject<ChatPreview[]> = new BehaviorSubject<ChatPreview[]>([]);
  private currentChat: BehaviorSubject<Chat> = new BehaviorSubject<Chat>({
    id: -5,
    name: 'undefined',
    avatarUrl: 'assets/icon/group.png',
    lastReadMessageId: 1,
    participants: [],
    messages: []
  });

  constructor(private SQLiteDbService: SQLiteService, private userService: UserService) {
    this.SQLiteDbService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getChatPreviewsFromDB();
      }
    })
  }

  getChatPreviewsFromDB() {
    this.SQLiteDbService.query(CHAT_PREVIEW_LIST_SQL).then(result => {
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
    this.SQLiteDbService.query(CHAT_BY_ID_SQL, [chatId.toString()]).then(result => {
        let chat: Chat = {
          id: result.values[0].chatId,
          name: result.values[0].chatName,
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

  createParticipant(values): User {
    return {
      id: values.participantId,
      name: values.participantName,
      avatarUrl: values.participantAvatar
    }
  }

  createMessage(values): Message {
    return {
      id: values.messageId,
      message: values.message,
      senderId: !values.sender_id ? null : values.sender_id,
      time: new Date(values.date_sent)
    }
  }

  getAllChats() {
    return this.chatsPreviewList.asObservable();
  }

  getChatById(chatId: number) {
    if (chatId != this.currentChat.value.id) {
      this.getChatByIdFromDB(chatId)
    }
    return this.currentChat.asObservable();
  }

  findChatsByName(name: string) {
    return this.chatsPreviewList.value.filter(chatPreview => chatPreview.name.toLowerCase().match("^" + name.toLowerCase() + ".*"));
  }

  sendMessage(vMessage:string, chatId: number) {
    this.saveMessage(chatId, null, new Date(), vMessage)
  }

  saveMessage(chatId: number, senderId: number, date_sent: Date, message: string) {
    this.SQLiteDbService.run(ADD_MESSAGE_SQL, [message, date_sent, chatId, senderId]).then(result => {
          if (!senderId) {
            this.SQLiteDbService.run(UPDATE_LAST_READ_MESSAGE_IN_CHAT_BY_ID_SQL,
                [result.changes.lastId, chatId]);
          }
          if (chatId === this.currentChat.value.id) {
            this.getChatByIdFromDB(chatId);
          }
          this.SQLiteDbService.run(UPDATE_LAST_MESSAGE_IN_CHAT_BY_ID_SQL,
              [result.changes.lastId, chatId]).then(result => this.getChatPreviewsFromDB());
    });
  }

  setLastReadMessages(messageId: number, chatId: number) {
    this.SQLiteDbService.run(UPDATE_LAST_READ_MESSAGE_IN_CHAT_BY_ID_SQL, [messageId, chatId]).then(() => {
          if (chatId === this.currentChat.value.id) {
            this.getChatByIdFromDB(chatId);
          }
          this.getChatPreviewsFromDB();
    });
  }

  findChatWithUserById(userId: number): Promise<number> {
    return this.SQLiteDbService.query(CHAT_PREVIEW_LIST_BY_NAME_SQL, [userId.toString()]).then(result => {
            return result.values.length === 1 ? result.values[0].id : null;
    })
  }

  createChatWithUser(contact: Contact) {
    //TODO create chat and return generated id
    return this.createNewGroup([contact], 'dialog', null)
  }

  async createNewGroup(members: Contact[], groupName: string, groupImageUrl: string) {
    let membersId: number[] = members.map(member => member.id);
    membersId.push(this.userService.getCurrentUserId().id)
    //TODO send to server

    return this.SQLiteDbService.run(ADD_CHAT_SQL, [groupName, groupImageUrl]).then(result => {
          let groupId = result.changes.lastId;
          for(let i = 0; i < members.length; i++) {
            this.SQLiteDbService.run(ADD_MEMBER_TO_CHAT_SQL, [groupId, members[i].id]);
          }
          this.getChatPreviewsFromDB();
          return groupId;
    });
  }
}
