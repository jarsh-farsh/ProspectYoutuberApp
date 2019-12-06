import { Injectable, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { OrderItem } from '../models/orderItem';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Observable, of } from 'rxjs';
import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';
import { GlobalMessageService } from './global-message.service';

@Injectable({
  providedIn: 'root'
})
export class CartService{

  _currentCart: OrderItem[] = [];
  get currentCart() : OrderItem[]{
    return this._currentCart; 
  }
  set currentCart(value: OrderItem[]){
    this._currentCart = value;
    this.setStorageCart();
  }

  errorMessage: any;

  constructor(private prodService: ProductService,
              private globalMessageService: GlobalMessageService,
              private authService: AuthService) {  this.init(); }

  init(){
    var cartstore = localStorage.getItem('cart');
    if (cartstore) {
      this.currentCart = JSON.parse(cartstore)['cart'];
    }else{
      this.currentCart = [];
    }
  }

  getTotalCost(): number{
    var cost = 0;
    for(var i = 0; i < this.currentCart.length; i++){
      cost += (this.currentCart[i].Product.price * this.currentCart[i].Quantity);
    }
    return cost;
  }

  getCart(): OrderItem[]{
    return this.currentCart;
  }

  AddItem(id: number, quantityAdded: number){
    var tmp;
    this.prodService.getProductByid(id).subscribe({
        next: (product: Product) => { this.AddToCart(product, quantityAdded) },
        error: err => this.errorMessage = err
      })

  }

  AddToCart(product: Product, quantityAdded: number){
    if (product) {
      //Check if product already exists in cart, if it does
      //update quantity
      var cartItem = this.currentCart.find(p => p.Product.id === product.id);
      if (cartItem) {
        cartItem.Quantity = +cartItem.Quantity + +quantityAdded;
      } else {
        var newItem = new OrderItem();
        newItem.Product = product;
        newItem.Quantity = quantityAdded;
        this.currentCart.push(newItem);
      }
      this.setStorageCart();
      this.globalMessageService.addMessage(`Successfully added item(s) to cart!`, 'success')
      return;
    }

    this.globalMessageService.addMessage(`Successfully added item(s) to cart!`, 'success')
  }

  RemoveItem(prodid: number): void{

    var itemFound = this.currentCart.find(p => p.Product.id === prodid);
    if (itemFound) {
      this.currentCart = this.currentCart.filter(i => i.Product !== itemFound.Product);
    }else{
      console.log("Item not found. id: ", prodid);
    }
    
  }

  UpdateItemQuantity(prodid:number, quantity:number):void{
    console.log(prodid);
    var itemFound = this.currentCart.find(p => p.Product.id === prodid);
    if(itemFound){
      itemFound.Quantity = quantity;
    }else{
      console.log("Item was not found");
    }
  }

  EmptyCart(): void{
    this.currentCart = [];
  }

  populateCart(items:any[]):void{
    for(var i = 0; i<items.length; i++){
      var cartItem = new OrderItem();
      var product;
      this.prodService.getProductByid(items[i].Product).subscribe({
        next: (product: Product) => product,
        error: err => this.errorMessage = err
      });
      cartItem.Product = product;
      cartItem.Order = null;
      cartItem.Quantity = items[i].Quantity;
      this.currentCart.push(cartItem);
    }
  }

  setStorageCart() {
    var user = JSON.parse(localStorage.getItem('currentUser'));
    if(!user){
      return;
    }
    user = user.username;
    var cart = JSON.parse(JSON.stringify(this.currentCart));

    var cartstore = {};
    cartstore['cart'] = cart;
    cartstore['user'] = user;
    localStorage.setItem('cart', JSON.stringify(cartstore));
  }
}
