import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanderRoutingModule } from './lander-routing.module';
import { LanderComponent } from './lander.component';

@NgModule({
  declarations: [
    LanderComponent
  ],
  imports: [
    CommonModule,
    LanderRoutingModule
  ]
})
export class LanderModule { }
