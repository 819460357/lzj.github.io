import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeAddComponent } from './qrcode-add.component';

describe('QrcodeAddComponent', () => {
  let component: QrcodeAddComponent;
  let fixture: ComponentFixture<QrcodeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
