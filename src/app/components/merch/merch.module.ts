import { NgModule } from '@angular/core';
import { MerchComponent } from './merch.component';
import { MerchDetailsComponent } from './merch-details.component';
import { CartComponent } from './cart.component';
import { CheckoutComponent } from './checkout.component';
import { MerchRoutingModule } from './merch-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MerchComponent,
    MerchDetailsComponent,
    CartComponent,
    CheckoutComponent
  ],
  imports: [
    SharedModule,
    MerchRoutingModule,
  ]
})
export class MerchModule { }
