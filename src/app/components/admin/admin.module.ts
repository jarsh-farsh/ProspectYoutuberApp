import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AddProductComponent } from './add-product.component';
import { AddBlogComponent } from './add-blog.component';
import { ViewOrdersComponent } from './view-orders.component';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [
    AdminComponent,
    AddProductComponent,
    AddBlogComponent,
    ViewOrdersComponent,
    UsersComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }