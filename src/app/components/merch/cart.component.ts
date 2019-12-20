import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { OrderItem } from 'src/app/models/orderItem';
import { ProductService } from 'src/app/services/product.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { MerchDialogComponent } from './merch-dialog.component';
import { GlobalMessageService } from 'src/app/services/global-message.service';
import { Product } from 'src/app/models/product';
import { DATA_UTILS } from 'src/app/utils/utilities';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductData } from 'src/app/models/productData';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  updateQuantity: number[];
  errorMessage: string[];
  showErrorMessage: boolean[];

  currentCart: OrderItem[] = [];

  get CartTotal():number{
    return this.cartService.getTotalCost();
  }

  constructor(private cartService: CartService,
              private prodService: ProductService,
              private orderService: OrderService,
              private gmService: GlobalMessageService,
              private authService: AuthService,
              private dialog: MatDialog) { }

  ngOnInit() {
    var cartStore = JSON.parse(localStorage.getItem('cart'));
    if(!cartStore && this.cartService.currentCart.length > 0){
      this.cartService.init();
    }

    this.getCurrentCart();
    this.updateQuantity = [];
    this.errorMessage = [];
    this.showErrorMessage = [];

    if(this.currentCart){
      this.populateUpdateQuantites();
    }
  }

  getCurrentCart():void{
    this.currentCart = this.cartService.getCart();
  }

  getProductImg(img: string): string{
    return this.prodService.getProductImageSrc(img);
  }

  populateUpdateQuantites():void{
    for(var i = 0; i < this.currentCart.length; i++){
      this.updateQuantity[i] = this.currentCart[i].Quantity;
    }
  }

  checkUpdate(quantity:number, index:number):boolean{
    if(quantity){
      if(!isNaN(quantity)){
        if(quantity !== this.currentCart[index].Quantity){
          if(quantity > 0 && quantity < 11){
                    this.errorMessage[index] = '';
                    return true;
          }else{
          this.errorMessage[index] = "Quantity needs to be between 1 and 10";
          return false;
          }
        }else{
          this.errorMessage[index] = "Quantity needs to be different then the original quantity";
          return false;
        }
      }else{
        this.errorMessage[index] = "Quantity needs to be an integer";
        return false;
      }
    }else{
      this.errorMessage[index] = "Quantity needs to have a value";
      return false;
    }
  }

  removeItemFromCart(id:number, quantId: number):void {
    this.cartService.RemoveItem(id);
    this.getCurrentCart();
    this.updateQuantity.splice(quantId, 1);
  }

  clearCart():void{
    this.cartService.EmptyCart();
    this.getCurrentCart();
    this.updateQuantity = [];
  }

  updateItem(id:number, quantity:number, index:number):void{
    if(this.checkUpdate(quantity,index)){
      this.cartService.UpdateItemQuantity(id, quantity);
    }else{
      this.showErrorMessage[index] = true;
    }
  }

  checkout():void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: "Checkout",
      items: this.currentCart,
      total: this.CartTotal
    }

    const dialogRef = this.dialog.open(MerchDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: res => {
        if(res){
          this.confirmOrder();
        }
      },
      error: err => {
        this.gmService.addMessage("There was an issue finishing your checkout. Sorry!", "error");
      }
    })
  }

  async confirmOrder(){
    var products = [];
    this.currentCart.forEach(item => {
      item.product.quantity_sold += +item.Quantity;
      item.product.quantity_in_stock -= +item.Quantity;
      products.push(item.product);
    })
    var data = this.mapOrderData(products);
    const orderResults = await this.orderService.addOrder(data).toPromise();
    data.products.forEach(async p => {
      const productResults = await this.prodService.updateProduct({product: p}).toPromise();
      if(productResults.error){
        //Log error
        console.log(`Error updating ${p.name}`);
        this.gmService.addMessage(`There was an issue completeing your order! Sorry!`, 'error');
        return;
      }
    })
    if(orderResults.error){
      //Log error
      console.log(`Error adding order`);
      this.gmService.addMessage(`There was an issue completeing your order! Sorry!`, 'error');
      return;
    }

    this.cartService.EmptyCart();
    this.gmService.addMessage(`Successfully completed order! Thank you!`, 'success');
    this.getCurrentCart();
  }

  mapOrderData(products: Product[]): any{
    var productData = [];
    products.forEach(p => {
      productData.push({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity_in_stock: p.quantity_in_stock,
        quantity_sold: p.quantity_sold,
      })
    });
    var orderData = {
      order_num: DATA_UTILS.generateOrderNumber(),
      user_id: this.authService.currentUser.id,
      total_cost: this.CartTotal
    };
    var orderItemData = [];
    this.currentCart.forEach(i => {
      orderItemData.push({
        product_id: i.product.id,
        quantity: i.Quantity
      })
    })
    return {
      products: products,
      order: orderData,
      orderItems: orderItemData
    }

  }
}
