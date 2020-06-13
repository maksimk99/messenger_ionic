import {Component, Input, OnInit} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {

  @Input() contact: Contact;
  @Input() selected: boolean;

  constructor() { }

  lastSeenFormat(dateToFormat: Date) {
    let result = "last seen ";
    const differenceInDays = Math.floor(Math.abs((new Date().getTime() - dateToFormat.getTime()) / (1000 * 60 * 60 * 24)));
    if (differenceInDays === 1) {
      result += "yesterday";
    } else if (differenceInDays > 1){
      result += formatDate(dateToFormat, "MMMM d", 'en-US');
    }
    return result + formatDate(dateToFormat, "' at' HH:mm", 'en-US');;
  }
}
