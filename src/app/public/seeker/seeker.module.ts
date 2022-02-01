import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeekerRoutingModule } from './seeker-routing.module';
import { SeekerComponent } from './seeker.component';


@NgModule({
  declarations: [
    SeekerComponent
  ],
  imports: [
    CommonModule,
    SeekerRoutingModule
  ]
})
export class SeekerModule { }
