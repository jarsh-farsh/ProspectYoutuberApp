import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { OrderService } from 'src/app/services/order.service';
import { DATA_UTILS, IMG_UTILS, ARRAY_UTILS } from 'src/app/utils/utilities';
import { ProductService } from 'src/app/services/product.service';
import { OrderItem } from 'src/app/models/orderItem';
import { summaryFileName } from '@angular/compiler/src/aot/util';
import { GlobalMessageService } from 'src/app/services/global-message.service';
import { ProductData } from 'src/app/models/productData';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {

  id:number = 2;
  orders: Order[] = [];
  selectedOrders: Order[] = [];
  selectedOrdersProduct: Boolean[] = [];

  orderSelected: boolean = false;

  searchedUser: string = '';
  searchedOrder: string = '';
  searchedUserError: string;
  searchedOrderError: string;

  products: Product[];
  selectedProduct: Product;
  productData: ProductData[];
  formatedData: any[];
  showData: boolean = false;

  constructor(private orderService: OrderService,
              private productService: ProductService,
              private gmService: GlobalMessageService) { }

  ngOnInit() {
    this.init();
  }

  init(){
    this.orderService.getAllOrders(true).subscribe({
      next: orders => {
        this.populateOrders(orders);
      }
    })
    this.productService.getProducts(true).subscribe({
      next: products => {
        this.products = products;
      }
    })
  }

  populateOrders(orders: Order[]){
    orders.forEach(o => {
      if(!o.order_num) o.order_num = DATA_UTILS.generateOrderNumber();
      o.items.forEach(async i => {
        var result = await this.getProductImages(i);
        result.subscribe({
          next: res => {
            if(!i.product.image_url) i.product.image_url = [];
            res.forEach(u => {
              i.product.image_url.push(u.url);
            })
          }
        })
      });
      
    })
    this.orders = orders;
  }

  async getProductImages(item: OrderItem){
    return this.productService.getProductImageById(item.product.id);
  }

  selectOrder(num: string[]){
    if(num){
      var orders = [];
      for (let i = 0; i < num.length; i++) {
        var tmp = this.orders.find(o => o.order_num === num[i]);
        if(tmp) orders.push(tmp);  
      }
      this.selectedOrders = orders;
    }
    this.selectedOrders.forEach(o => {
      this.selectedOrdersProduct.push(false);
    })
    this.orderSelected = true;
  }

  searchBy(choice: number){
    var orders;
    if(choice === 1){
      if(this.searchedOrder === ''){
        this.searchedOrderError = 'Input an order number to search';
        return
      }
      orders = this.orders.filter(o => o.order_num === this.searchedOrder);
    }else if(choice === 2){
      if(this.searchedUser === ''){
        this.searchedUserError = 'Input a username to search';
        return
      }
      orders = this.orders.filter(o => o.user.username === this.searchedUser);
    }else{
      return;
    }

    if(orders.length === 0){ 
      if(choice === 1) this.searchedOrderError = 'No order found with this order number';
      else this.searchedUserError = 'No order found with this username';

      return;
    }
    this.selectedOrders = orders;

    this.selectOrder(null);    
    this.searchedOrder = '';
    this.searchedUser = '';
  }

  clearOrder(){
    this.orderSelected = false;
    this.selectedOrders = [];
    this.selectedOrdersProduct = [];
  }

  toggleProductData(i: number){
    this.selectedOrdersProduct[i] = !this.selectedOrdersProduct[i];
  }

  getProductImage(product: Product){
    if(!product.image_url || product.image_url.length === 0){
      return IMG_UTILS.NoImageAvailable();
    }
    return IMG_UTILS.GetImageUrl(product.image_url[0]);
  }

  selectProduct(product: Product){
    if(product.quantity_sold === 0){
      this.gmService.addMessage(`There is no data for ${product.name}`, 'info');
      return;
    }
    this.selectedProduct = product;
    this.orderService.getProductData(product.id).subscribe({
      next: data => {
        this.productData = this.sortProductData(data);
        this.showData = true;
      }
    })
  }

  sortProductData(data: ProductData[]): ProductData[]{
    data.sort((a,b) => {
      return ARRAY_UTILS.sortByDateAsc(a.created_on,b.created_on);
    })
    var years = [];
    data.forEach(d => {
      var year = parseInt(d.created_on.toString().substr(0,4));
      var tmp = years.find(y => y.year === year);
      if(!tmp) years.push({year: year, quantity: d.quantity});
      else years.find(y => y.year === year).quantity += +d.quantity;
    })
    var addedYears = false;
    var yearsNeeded = [];
    var tmp;
    for(var i = 0; i < years.length; i++){
      if(tmp){
        var difference = years[i].year - tmp;
        while(difference > 1){
          tmp += 1;
          yearsNeeded.push({year: tmp, quantity: 0});
          if(!addedYears) addedYears = true;
          difference--;
        }
      }
      tmp = years[i].year;
    }
    if(addedYears){
      years = years.concat(yearsNeeded);
      years = years.sort((a,b) => {
        return ARRAY_UTILS.sortByDateAsc(a.year, b.year);
      });
    }
    this.formatedData = years;
    return data
  }

  clearData(){
    this.showData = false;
  }
}
