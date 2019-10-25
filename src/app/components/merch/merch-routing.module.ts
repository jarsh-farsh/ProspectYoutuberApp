import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchComponent } from './merch.component';
import { MerchDetailsComponent } from './merch-details.component';
import { CartComponent } from './cart.component';

const routes: Routes = [
    { path: 'merch', component: MerchComponent },
    { path: 'merch/:id/details', component: MerchDetailsComponent },
    { path: 'cart', component: CartComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchRoutingModule { }