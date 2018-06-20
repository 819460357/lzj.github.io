import { TestBed, inject } from '@angular/core/testing';

import { MerchAddService } from './merch-add.service';

describe('MerchAddService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MerchAddService]
    });
  });

  it('should be created', inject([MerchAddService], (service: MerchAddService) => {
    expect(service).toBeTruthy();
  }));
});
