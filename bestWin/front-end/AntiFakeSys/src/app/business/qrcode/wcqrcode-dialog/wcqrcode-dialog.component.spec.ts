import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WcqrcodeDialogComponent } from './wcqrcode-dialog.component';

describe('WcqrcodeDialogComponent', () => {
  let component: WcqrcodeDialogComponent;
  let fixture: ComponentFixture<WcqrcodeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WcqrcodeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WcqrcodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
