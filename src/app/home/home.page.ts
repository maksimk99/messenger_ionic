import {Component, OnInit} from '@angular/core';
import {ChatPreview} from "./chat-preview.model";
import {ChatService} from "./chat.service";
import {formatDate} from "@angular/common";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    chats: ChatPreview[];
    currentUserId: string;

    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        this.chats = this.chatService.getAllChats();
        this.currentUserId = this.chatService.gerCurrentUserId();
    }

    deleteChat(chatId: string) {
        //delete chat, should get chat id
    }

    lastMessageSenderName(chatPreview: ChatPreview): string {
        return this.currentUserId == chatPreview.lastMessageSenderId ? "Me: " : chatPreview.lastMessageSenderName + ": ";
    }

    lastMessageDate(date: Date): string {
        const differenceInDays = Math.floor(Math.abs((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)));
        return differenceInDays < 1 ? formatDate(date, "HH:mm", 'en-US') : formatDate(date, "MMMM d", 'en-US');
    }
}
