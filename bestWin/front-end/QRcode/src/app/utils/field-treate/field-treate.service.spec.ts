import { TestBed, inject } from '@angular/core/testing';

import { FieldTreateService } from './field-treate.service';

describe('FieldTreateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FieldTreateService]
    });
  });

  it('should be created', inject([FieldTreateService], (service: FieldTreateService) => {
    expect(service).toBeTruthy();
  }));
});
