import {Component, OnInit} from '@angular/core';
import {ChatPreview} from "../models/chat-preview.model";
import {ChatService} from "../services/chat.service";
import {formatDate} from "@angular/common";
import {CurrentUser} from "../models/current-user.model";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    chats: ChatPreview[];
    currentUser: CurrentUser;
    searchString: string;
    isSearchActive: boolean = false;

    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        this.chats = this.chatService.getAllChats();
        this.currentUser = this.chatService.getCurrentUser();
    }

    ionViewWillLeave() {
        this.deActivateSearch();
    }

    activateSearch() {
        this.isSearchActive = true;
    }

    deActivateSearch() {
        this.isSearchActive = false;
        this.chats = this.chatService.getAllChats();
    }

    findChats() {
        this.chats = this.chatService.findChatsByName(this.searchString);
    }

    deleteChat(chatId: string) {
        //delete chat, should get chat id
    }

    lastMessageSenderName(chatPreview: ChatPreview): string {
        return this.currentUser.id == chatPreview.lastMessageSenderId ? "Me: " : chatPreview.lastMessageSenderName + ": ";
    }

    lastMessageDate(date: Date): string {
        const differenceInDays = Math.floor(Math.abs((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)));
        return differenceInDays < 1 ? formatDate(date, "HH:mm", 'en-US') : formatDate(date, "MMMM d", 'en-US');
    }
}
