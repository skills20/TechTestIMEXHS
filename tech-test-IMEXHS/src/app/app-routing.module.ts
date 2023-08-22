import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Section1Component } from './components/section1/section1.component';
import { Section2Component } from './components/section2/section2.component';

const routes: Routes = [
  {
    path:'',
    component: Section1Component,
  },
  {
    path:'section2',
    component: Section2Component,
  },
  { 
    path: '',   
    redirectTo: '', 
    pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
