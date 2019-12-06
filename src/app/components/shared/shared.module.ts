import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductTabComponent } from './product-tab.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material';
import { CheckImgUrlPipe } from './checkImgUrl.pipe';

@NgModule({
  declarations: [
    ProductTabComponent,
    CheckImgUrlPipe
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
    CheckImgUrlPipe,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
