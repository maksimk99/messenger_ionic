import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Contact} from "../../models/contact.model";
import {AlertController} from "@ionic/angular";
import {CameraService} from "../../services/camera.service";
import {ChatService} from "../../services/chat.service";
import {CameraPhoto} from "@capacitor/core";
import {UserService} from "../../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-gtoup-chat-submit',
  templateUrl: './gtoup-chat-submit.page.html',
  styleUrls: ['./gtoup-chat-submit.page.scss'],
})
export class GtoupChatSubmitPage implements OnInit {

  selectedContacts: Contact[] = [];
  groupName: string;
  groupImageUrl: string = 'assets/icon/camera.png'
  groupImage: CameraPhoto;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private alertController: AlertController,
              private cameraService: CameraService,
              private userService: UserService,
              private chatService: ChatService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.selectedContacts = this.router.getCurrentNavigation().extras.state.selectedContacts;
      }
    });
  }

  async selectImageSource() {
    const alert = await this.alertController.create({
      header: "Select source",
      message: "Pick a source for your image",
      buttons: [
        {
          text: "Camera",
          handler: () => {
            this.cameraService.takePictureByCamera().then(image => {
                  this.groupImageUrl = image.webPath;
                  this.groupImage = image;
                }
            );
          }
        },
        {
          text: "Gallery",
          handler: () => {
            this.cameraService.takePictureFromGallery().then(image => {
                  this.groupImageUrl = image.webPath;
                  this.groupImage = image;
                }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  submit() {
    this.chatService.createNewGroup(this.selectedContacts, this.groupName, this.groupImage, this.userService.getCurrentUserId()).then(result => {
      this.router.navigate(['/chats', result]);
    }).catch((err: HttpErrorResponse) => {
      this.alertController.create({
        header: 'Connection failed',
        message: "<h6>Cannot connect to the server</h6>" +
            "<p><i>Please check your internet connection and try again.</i></p>",
        buttons: ['OK']
      }).then(alert => alert.present());
    });
  }
}
