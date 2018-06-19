import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemuItemComponent } from './memu.item.component';

describe('MemuItemComponent', () => {
  let component: MemuItemComponent;
  let fixture: ComponentFixture<MemuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemuItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
