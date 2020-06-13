import { Component, OnInit } from '@angular/core';
import {Contact} from "../models/contact.model";
import {ContactsService} from "../services/contacts.service";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.page.html',
  styleUrls: ['./group-chat.page.scss'],
})
export class GroupChatPage implements OnInit {

  contacts: Contact[];
  searchString: string;
  selectedContacts: Contact[] = [];
  constructor(private contactsService: ContactsService, private router: Router) { }

  ngOnInit() {
    this.contacts = this.contactsService.getContacts();
  }

  submitSelected() {
    let navigationExtras: NavigationExtras = {
      state: {
        selectedContacts: this.selectedContacts
      }
    };
    this.router.navigate(['/groupChatCreate/submit'], navigationExtras);
  }

  findContacts() {
    this.contacts = this.contactsService.findContactsByName(this.searchString);
  }

  addContactToChat(contact: Contact) {
    this.selectedContacts.push(contact);
  }

  removeContactFromChat(contactId: string) {
    this.selectedContacts = this.selectedContacts.filter(contact => contact.id !== contactId);
  }
}
