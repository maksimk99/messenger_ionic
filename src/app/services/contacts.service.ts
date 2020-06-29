import { Injectable } from '@angular/core';
import {Contact} from "../models/contact.model";
import {SQLiteService} from "./database/sqlite.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Capacitor, Filesystem, FilesystemDirectory} from "@capacitor/core";
import {FileWriterService} from "./file-writer.service";

const GET_CONTACT_LIST_SQL = "SELECT * FROM contact"
const ADD_CONTACT_SQL = "INSERT INTO contact(id, name, last_seen, avatar_url) VALUES (?, ?, ?, ?)"

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private contactsList: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);

  constructor(private SQLiteDbService: SQLiteService, private fileWriterService: FileWriterService) {
    this.SQLiteDbService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getContactsFromDB();
      }
    })
  }

  getContacts(): Observable<Contact[]> {
    return this.contactsList.asObservable();
  }

  getContactsFromDB() {
    this.SQLiteDbService.query(GET_CONTACT_LIST_SQL).then(result => {
      this.contactsList.next(this.getItems(result.values))
    })
  }

  findContactsByName(name: string) {
    return this.contactsList.value.filter(contact => contact.name.toLowerCase().match("^" + name.toLowerCase() + ".*"));
  }

  getItems(values: Array<any>) {
    let items: Contact[] = [];
    if (values.length > 0) {
      for (let i = 0; i < values.length; i++) {
        let contact: Contact = {
          id: values[i].id,
          name: values[i].name,
          avatarUrl: values[i].avatar_url,
          lastSeen: new Date(values[i].last_seen)
        };
        items.push(contact);
      }
    }
    return items;
  }

  addNewContact(phoneNumber: string) {
    //TODO send query to server to get user by phone number
    let contact: Contact = {
      id: this.contactsList.value.length + 2,
      name: 'newUserName' + (this.contactsList.value.length + 2),
      lastSeen: new Date(),
      avatarUrl: 'assets/icon/user.png'
    }
    this.SQLiteDbService.run(ADD_CONTACT_SQL,
          [contact.id, contact.name, contact.lastSeen, contact.avatarUrl])
          .then(() => this.getContactsFromDB());
    //return else if contact with this phone number already exists
    return true;
  }
}
