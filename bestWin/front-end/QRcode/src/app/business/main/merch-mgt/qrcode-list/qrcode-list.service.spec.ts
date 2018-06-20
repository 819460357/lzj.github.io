import { TestBed, inject } from '@angular/core/testing';

import { QrcodeListService } from './qrcode-list.service';

describe('QrcodeListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QrcodeListService]
    });
  });

  it('should be created', inject([QrcodeListService], (service: QrcodeListService) => {
    expect(service).toBeTruthy();
  }));
});
