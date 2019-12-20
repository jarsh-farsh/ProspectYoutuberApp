import { NgModule } from '@angular/core';
import { MerchComponent } from './merch.component';
import { MerchDetailsComponent } from './merch-details.component';
import { CartComponent } from './cart.component';
import { CheckoutComponent } from './checkout.component';
import { MerchRoutingModule } from './merch-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MerchDialogComponent } from './merch-dialog.component';

@NgModule({
  declarations: [
    MerchComponent,
    MerchDetailsComponent,
    CartComponent,
    CheckoutComponent,
    MerchDialogComponent
  ],
  imports: [
    SharedModule,
    MerchRoutingModule,
  ],
  entryComponents: [MerchDialogComponent]
})
export class MerchModule { }
