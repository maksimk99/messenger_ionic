import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CountryISO, SearchCountryField, TooltipLabel} from 'ngx-intl-tel-input';
import {ContactsService} from "../../services/contacts.service";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-new-contact',
    templateUrl: './new-contact.page.html',
    styleUrls: ['./new-contact.page.scss'],
})
export class NewContactPage {

    SearchCountryField = SearchCountryField;
    TooltipLabel = TooltipLabel;
    CountryISO = CountryISO;
    preferredCountries: CountryISO[] = [CountryISO.Belarus, CountryISO.Russia];
    phoneForm = new FormGroup({
        phone: new FormControl(undefined, [Validators.required])
    });

    constructor(private contactsService: ContactsService, private alertController: AlertController,
                private router: Router) {
    }

    onSubmit() {
        this.contactsService.addNewContact(this.phoneForm.value.phone.internationalNumber).then(contactId => {
            if (contactId) {
                this.router.navigate(['/chats']);
            } else {
                this.presentAlert()
            }
        }).catch((err: HttpErrorResponse) => {
            this.alertController.create({
                header: 'Connection failed',
                message: "<h6>Cannot connect to the server</h6>" +
                    "<p><i>Please check your internet connection and try again.</i></p>",
                buttons: ['OK']
            }).then(alert => alert.present());
        });
    }

    async presentAlert() {
        const alert = await this.alertController.create({
            header: 'Cannot add contact',
            message: "<h6>User with phone number:<br><strong>" +
                this.phoneForm.value.phone.internationalNumber +
                "</strong><br>doesn't exist</h6>" +
                "<p><i>Please ask this user to install the app and create an account</i></p>",
            buttons: ['OK']
        });

        await alert.present();
    }
}



