import { TestBed, inject } from '@angular/core/testing';

import { MerchListService } from './merch-list.service';

describe('MerchListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MerchListService]
    });
  });

  it('should be created', inject([MerchListService], (service: MerchListService) => {
    expect(service).toBeTruthy();
  }));
});
