import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { BlogComponent } from './components/blog/blog.component';
import { MerchComponent } from './components/merch/merch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MerchDetailsComponent } from './components/merch/merch-details.component';
import { MerchRoutingModule } from './components/merch/merch-routing.module';
import { BlogEntryComponent } from './components/blog/blog-entry.component';
import { LoginComponent } from './components/user/login.component';
import { SignupComponent } from './components/user/signup.component';
import { BlogRoutingModule } from './components/blog/blog-routing.module';
import { UserRoutingModule } from './components/user/user-routing.module';
import { CartComponent } from './components/merch/cart.component';
import { CheckoutComponent } from './components/merch/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    BlogComponent,
    MerchComponent,
    MerchDetailsComponent,
    BlogEntryComponent,
    LoginComponent,
    SignupComponent,
    CartComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MerchRoutingModule,
    BlogRoutingModule,
    UserRoutingModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
