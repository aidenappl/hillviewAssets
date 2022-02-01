import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/pos',
    pathMatch: 'full',
  },
  {
    path: 'pos',
    loadChildren: () =>
      import('./public/lander/lander.module').then((m) => m.LanderModule),
  },
  {
    path: 'seeker',
    loadChildren: () =>
      import('./public/seeker/seeker.module').then((m) => m.SeekerModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./public/err404/err404.module').then((m) => m.Err404Module),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
