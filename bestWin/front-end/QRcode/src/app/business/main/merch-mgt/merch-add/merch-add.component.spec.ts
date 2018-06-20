import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchAddComponent } from './merch-add.component';

describe('MerchAddComponent', () => {
  let component: MerchAddComponent;
  let fixture: ComponentFixture<MerchAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
