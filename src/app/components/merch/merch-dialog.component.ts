import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrderItem } from 'src/app/models/orderItem';
import { IMG_UTILS } from 'src/app/utils/utilities';

@Component({
  selector: 'app-merch-dialog',
  templateUrl: './merch-dialog.component.html',
  styleUrls: ['./merch-dialog.component.css']
})
export class MerchDialogComponent implements OnInit {

  title:string;
  total:number;
  items: OrderItem[];

  constructor(private dialogRef: MatDialogRef<MerchDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) { 
                this.title = data.title;
                this.total = data.total;
                this.items = data.items;
              }

  ngOnInit() {
  }

  getProductImage(url: string){
    return IMG_UTILS.GetImageUrl(url);
  }

  confirm(){
    var data = true;
    this.dialogRef.close(data);
  }

  cancel(){
    this.dialogRef.close(false);
  }

}
