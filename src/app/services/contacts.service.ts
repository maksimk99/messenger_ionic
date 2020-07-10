import { Injectable } from '@angular/core';
import {Contact} from "../models/contact.model";
import {SQLiteService} from "./database/sqlite.service";
import {BehaviorSubject, Observable} from "rxjs";
import {ContactDTO} from "../models/loginresponse.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {SQLQuery} from "../properties/SQLQuery"
import {Properties} from "../properties/Properties";

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private contactsList: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);

  constructor(private SQLiteDbService: SQLiteService, private httpClient: HttpClient) {
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
    this.SQLiteDbService.query(SQLQuery.GET_CONTACT_LIST).then(result => {
      this.contactsList.next(this.getItems(result.values))
    })
  }

  findContactsByName(name: string) {
    return this.contactsList.value.filter(contact => contact.contactName.toLowerCase().match("^" + name.toLowerCase() + ".*"));
  }

  getItems(values: Array<any>) {
    let items: Contact[] = [];
    if (values.length > 0) {
      for (let i = 0; i < values.length; i++) {
        let contact: Contact = {
          contactId: values[i].id,
          contactName: values[i].name,
          phoneNumber: values[i].phoneNumber,
          avatarUrl: values[i].avatar_url,
          lastSeen: new Date(values[i].last_seen)
        };
        items.push(contact);
      }
    }
    return items;
  }

  addNewContact(phoneNumber: string): Promise<number> {
    let params = new HttpParams().set('phoneNumber', phoneNumber);
    return this.httpClient.get<Contact>(Properties.BASE_URL + "/user", { params: params }).toPromise().then((contact: Contact) => {
      if (contact !== null) {
        return this.SQLiteDbService.run(SQLQuery.ADD_CONTACT,
            [contact.contactId, contact.contactName, contact.lastSeen, contact.phoneNumber, contact.avatarUrl]).then(() => {
              this.getContactsFromDB();
              return contact.contactId
            });
      } else {
       return null;
      }
    });
  }

  async saveContactListToDatabase(contacts: ContactDTO[]) {
    for(let i = 0; i < contacts.length; i++) {
      await this.SQLiteDbService.run(SQLQuery.ADD_CONTACT,
          [contacts[i].userId, contacts[i].userName, contacts[i].lastSeen, contacts[i].phoneNumber, contacts[i].avatarUrl]);
    }
    this.getContactsFromDB();
  }
}
