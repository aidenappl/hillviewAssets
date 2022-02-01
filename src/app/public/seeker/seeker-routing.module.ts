import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeekerComponent } from './seeker.component';

const routes: Routes = [{ path: '', component: SeekerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeekerRoutingModule { }
