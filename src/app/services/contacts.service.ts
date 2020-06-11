import { Injectable } from '@angular/core';
import {Contact} from "../models/contact.model";

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private contacts: Contact[] = [
    {
      id: 'user1',
      name: 'Alex Stephanov',
      avatarUrl: 'https://pickaface.net/gallery/avatar/Shahin_Hanafi5775381770e1f.png',
      lastSeen: new Date(2020, 4, 29, 21, 12, 0, 0)
    },
    {
      id: 'user3',
      name: 'Mark Shulgan',
      avatarUrl: 'https://pickaface.net/gallery/avatar/20151205_194059_2696_Chat.png',
      lastSeen: new Date(2020, 5, 1, 11, 12, 0, 0)
    },
    {
      id: 'user4',
      name: 'Pavel Kachurka',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRak8gbDrVjGID2DGz0I3irv0up0tuqt97AEFevYyMkZbYi-8ND&usqp=CAU',
      lastSeen: new Date(2020, 4, 31, 21, 12, 0, 0)
    },
    {
      id: 'user5',
      name: 'Алина Концевич',
      avatarUrl: 'https://techday24.com/wp-content/uploads/2020/05/Facebook-avatar-2020-2.jpg',
      lastSeen: new Date(2020, 4, 31, 15, 37, 0, 0)
    },
    {
      id: 'user6',
      name: 'Даниил Федорович',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQKYgIpJ-RRcHnyQcXwfWUNtzEHLURfUm9NRqaqYyNXpr1cTQze&usqp=CAU',
      lastSeen: new Date(2020, 5, 1, 9, 12, 0, 0)
    },
    {
      id: 'user7',
      name: 'Марк Никитков',
      avatarUrl: 'https://vignette.wikia.nocookie.net/avatar/images/8/85/Royal_messenger.png/revision/latest/top-crop/width/360/height/360?cb=20140510204457',
      lastSeen: new Date(2020, 3, 12, 11, 12, 0, 0)
    }
  ]

  constructor() { }

  getContacts() {
    return [...this.contacts];
  }

  findContactsByName(name: string) {
    return [...this.contacts.filter(contact => contact.name.toLowerCase().match("^" + name.toLowerCase() + ".*"))];
  }

  addNewContact(phoneNumber: string) {
    //TODO send query to server to get user by phone number
    return false;
  }
}
