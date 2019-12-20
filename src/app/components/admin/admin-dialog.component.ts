import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductTag } from 'src/app/models/ProductTag';

@Component({
  selector: 'app-admin-dialog',
  templateUrl: './admin-dialog.component.html',
  styleUrls: ['./admin-dialog.component.css']
})
export class AdminDialogComponent implements OnInit {

  title: string;
  description: string;
  isProduct: boolean;
  images: string[];
  tags: ProductTag[];
  name:string;
  prodDescription:string;
  price:number;
  quantity:number

  isUser:boolean;
  username: string;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<AdminDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) { 
                this.title = data.title;
                this.description = data.description;             
                if(data.product){
                  this.isProduct = true;
                  this.images = data.images;
                  this.tags = data.tags;
                  this.name = data.product.name;
                  this.prodDescription = data.product.description;
                  this.price = data.product.price;
                  this.quantity = data.product.quantity_in_stock;
                }
                if(data.user){
                  this.isUser = true;
                  this.username = data.user.username;
                }
              }

  ngOnInit() {
    
  }

  confirm(){
    var data = true;


    this.dialogRef.close(data);
  }

  cancel(){
    this.dialogRef.close(false);
  }

}
