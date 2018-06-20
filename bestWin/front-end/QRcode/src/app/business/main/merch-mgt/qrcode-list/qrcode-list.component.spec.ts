import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeListComponent } from './qrcode-list.component';

describe('QrcodeListComponent', () => {
  let component: QrcodeListComponent;
  let fixture: ComponentFixture<QrcodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
