import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductTabComponent } from './product-tab.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material';


@NgModule({
  declarations: [
    ProductTabComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  exports:[
    ProductTabComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class SharedModule { }
