import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { OrderItem } from 'src/app/models/orderItem';

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

  constructor(private cartService: CartService) { }

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
    console.log(this.updateQuantity);
    this.updateQuantity.splice(quantId, 1);
    console.log(this.updateQuantity);
  }

  clearCart():void{
    this.cartService.EmptyCart();
    this.getCurrentCart();
    this.updateQuantity = [];
  }

  updateItem(id:number, quantity:number, index:number):void{

    console.log("Quantity: ", quantity);
    if(this.checkUpdate(quantity,index)){
      this.cartService.UpdateItemQuantity(id, quantity);
      console.log("CurrentCart, ", this.currentCart);
    }else{
      this.showErrorMessage[index] = true;
    }
  }

  checkout():void{
    //TODO: Implement checkout
  }
}
