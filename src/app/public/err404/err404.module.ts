import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Err404RoutingModule } from './err404-routing.module';
import { Err404Component } from './err404.component';


@NgModule({
  declarations: [
    Err404Component
  ],
  imports: [
    CommonModule,
    Err404RoutingModule
  ]
})
export class Err404Module { }
