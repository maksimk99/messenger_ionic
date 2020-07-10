import {Component, OnInit} from '@angular/core';
import {Contact} from "../models/contact.model";
import {ContactsService} from "../services/contacts.service";
import {ChatService} from "../services/chat.service";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";

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
              private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.contactsService.getContacts().subscribe(contacts => {
      this.contacts = contacts;
    });
  }

  activateSearch() {
    this.isSearchActive = true;
  }

  deActivateSearch() {
    this.isSearchActive = false;
    this.contactsService.getContacts().subscribe(contacts => {
      this.contacts = contacts;
    });
  }

  async findContacts() {
    this.contacts = await this.contactsService.findContactsByName(this.searchString);
  }

  openChatWithContact(contactId: number) {
    this.chatService.findChatWithUserById(contactId).then(chatId => {
      if (chatId !== null) {
        this.router.navigate(['/chats/', chatId])
      } else {
        let contact = this.contacts.find(contact => contact.contactId === contactId);
        this.chatService.createChatWithUser(contact, this.userService.getCurrentUserId()).then(chatId =>
            this.router.navigate(['/chats/', chatId]));
      }
    });
  }
}
