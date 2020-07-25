import {Component, OnInit} from '@angular/core';
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
    this.contactsService.getContacts().subscribe(contacts => {
      this.contacts = contacts;
    });
  }

  submitSelected() {
    let navigationExtras: NavigationExtras = {
      state: {
        selectedContacts: this.selectedContacts
      }
    };
    this.router.navigate(['/groupChatCreate/submit'], navigationExtras);
  }

  async findContacts() {
    this.contacts = await this.contactsService.findContactsByName(this.searchString);
  }

  addContactToChat(contact: Contact) {
    this.selectedContacts.push(contact);
  }

  removeContactFromChat(contactId: number) {
    this.selectedContacts = this.selectedContacts.filter(contact => contact.contactId !== contactId);
  }
}
