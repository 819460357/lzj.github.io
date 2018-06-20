import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './memu.component';
import { MemuItemComponent } from './memu.item/memu.item.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    MenuComponent
  ],
  declarations: [MenuComponent, MemuItemComponent],
})
export class MemuModule { }
