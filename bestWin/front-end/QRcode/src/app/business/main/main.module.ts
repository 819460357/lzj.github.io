import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MainService } from './main.service';

import { MemuModule } from '../memu/memu.module';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    MemuModule
  ],
  declarations: [MainComponent],
  providers: [ MainService ],
})
export class MainModule { }
