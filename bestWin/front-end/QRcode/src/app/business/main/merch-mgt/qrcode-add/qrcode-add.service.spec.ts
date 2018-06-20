import { TestBed, inject } from '@angular/core/testing';

import { QrcodeAddService } from './qrcode-add.service';

describe('QrcodeAddService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QrcodeAddService]
    });
  });

  it('should be created', inject([QrcodeAddService], (service: QrcodeAddService) => {
    expect(service).toBeTruthy();
  }));
});
