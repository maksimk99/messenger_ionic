import {Component, OnInit} from '@angular/core';
import {Contact} from "../models/contact.model";
import {ContactsService} from "../services/contacts.service";
import {ChatService} from "../services/chat.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  contacts: Contact[];
  searchString: string;
  isSearchActive: boolean = false;

  constructor(private contactsService: ContactsService, private chatService: ChatService,
              private router: Router) { }

  ngOnInit() {
    this.contacts = this.contactsService.getContacts();
  }

  activateSearch() {
    this.isSearchActive = true;
  }

  deActivateSearch() {
    this.isSearchActive = false;
    this.contacts = this.contactsService.getContacts();
  }

  findContacts() {
    this.contacts = this.contactsService.findContactsByName(this.searchString);
  }

  openChatWithContact(contactId: string) {
    console.log('contact id: ' + contactId);
    let chatId: string = this.chatService.findChatWithUserById(contactId);
    if (chatId === null) {
      chatId = this.chatService.createChatWithUser(contactId);
    }
    this.router.navigate(['/chats/', chatId])
  }
}
