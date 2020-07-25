import { TestBed } from '@angular/core/testing';

import { WebSocketAPI } from './web-socket-a-p-i.service';

describe('WebSocketAPIService', () => {
  let service: WebSocketAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketAPI);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
