import {Component, OnInit} from '@angular/core';
import {ChatPreview} from "../models/chat-preview.model";
import {ChatService} from "../services/chat.service";
import {formatDate} from "@angular/common";
import {CurrentUser} from "../models/current-user.model";
import {UserService} from "../services/user.service";

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

    constructor(private chatService: ChatService, private userService: UserService) {
    }

    ngOnInit() {
        this.chatService.getAllChats().subscribe(chats => {
            this.chats = chats;
        });
        this.userService.getCurrentUser().subscribe(user => {
            this.currentUser = user;
        });
    }

    ionViewWillLeave() {
        this.deActivateSearch();
    }

    activateSearch() {
        this.isSearchActive = true;
    }

    deActivateSearch() {
        this.isSearchActive = false;
        this.chatService.getAllChats().subscribe(chats => {
            this.chats = chats;
        });
    }

    findChats() {
        this.chats = this.chatService.findChatsByName(this.searchString);
    }

    deleteChat(chatId: string) {
        //delete chat, should get chat id
    }

    lastMessageDate(date: Date): string {
        const differenceInDays = Math.floor(Math.abs((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)));
        return differenceInDays < 1 ? formatDate(date, "HH:mm", 'en-US') : formatDate(date, "MMMM d", 'en-US');
    }
}
