import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MainService } from './main.service';

import { MemuModule } from '../memu/memu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MainRoutingModule,
    MemuModule
  ],
  declarations: [MainComponent],
  providers: [ MainService ],
})
export class MainModule { }
