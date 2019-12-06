import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthAdminGuard } from './auth-admin.guard';
import { AddProductComponent } from './add-product.component';
import { AddBlogComponent } from './add-blog.component';
import { ViewOrdersComponent } from './view-orders.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
    { path: 'admin', component: AdminComponent,
      children: [
        { path: '', redirectTo: 'add-product', pathMatch: 'full' },
        { path: 'add-product', component: AddProductComponent },
        { path: 'add-blog', component: AddBlogComponent },
        { path: 'view-orders', component: ViewOrdersComponent },
        { path: 'users', component: UsersComponent }
      ]}//, canActivate: [AuthAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }