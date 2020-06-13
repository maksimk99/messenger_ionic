import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GtoupChatSubmitPage } from './gtoup-chat-submit.page';

describe('GtoupChatSubmitPage', () => {
  let component: GtoupChatSubmitPage;
  let fixture: ComponentFixture<GtoupChatSubmitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtoupChatSubmitPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GtoupChatSubmitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
