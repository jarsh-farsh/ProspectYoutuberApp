import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { FormGroup, FormControl } from '@angular/forms';
import { ProductTag } from 'src/app/models/ProductTag';

@Component({
  selector: 'app-merch',
  templateUrl: './merch.component.html',
  styleUrls: ['./merch.component.css']
})
export class MerchComponent implements OnInit {

  merchFilter: string = '';
  searchFilter: string = '';

  products: Product[] = [];
  filteredProducts: Product[] = [];

  productTags: ProductTag[] = [];

  availableTags: ProductTag[] = [];
  selectedTags: ProductTag[] = [];


  get PopularProducts(){
    return this.productService.getPopularProducts();
  }

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.products = this.productService.getProducts();
    this.productTags = this.productService.getProductTags();

    this.availableTags = this.productTags;
    this.availableTags = this.availableTags.sort((a,b) => (a.Name > b.Name) ? 1 : -1);

    if(this.searchFilter === ''){
      this.filteredProducts = this.products;
    }else{
      this.filterProductsBySearch();
    }
  }

  isPopularProduct(product: Product): boolean{
    return this.productService.isPopularProduct(product);
  }
  //Searches products by string filter
  search(){
    this.searchFilter = this.merchFilter;
    this.merchFilter = '';

    this.filterProductsBySearch();
  }
  //Clears the string search filter
  clearSearch(){
    this.searchFilter = '';

    this.filteredProducts = this.products;
    this.filterProductsByTags();
  }
  //Checks to see if there are any search parameters, if not set filtered products to all products
  filterProductsBySearch(){
    this.searchFilter = this.searchFilter.toLocaleLowerCase();
    if(this.filteredProducts.length === 0 || this.selectedTags.length === 0){
      this.filteredProducts = this.products.filter(p => p.Name.toLocaleLowerCase().indexOf(this.searchFilter) !== -1);
    }else{
      this.filteredProducts = this.filteredProducts.filter(p => p.Name.toLocaleLowerCase().indexOf(this.searchFilter) !== -1);
    }
  }
  //Filters products by selected search tags
  filterProductsByTags(){
    //Checks to see if there are any search parameters, if not set filtered products to all products
    if (this.selectedTags.length === 0 && this.searchFilter == '') {
      this.filteredProducts = this.products;
      return;
    }

    //Iterate through selected tags and find the products with matching tags
    for (var i = 0; i < this.selectedTags.length; i++) {
      if(i === 0){
        this.filteredProducts = this.products.filter(p => p.Tags.find(t => t === this.selectedTags[i].Id));
        console.log("product filter: ", this.filteredProducts);
      }else{
        this.filteredProducts = this.filteredProducts.filter(p => p.Tags.find(t => t === this.selectedTags[i].Id));
        console.log("filtered filter: ", this.filteredProducts);
      }
    }

    console.log("filteredProducts count: ", this.filteredProducts.length);
    //If tags have been applied or removed, check to see if selected products match the string input search
    if (this.searchFilter != '' && this.filteredProducts.length !== 0) {
      this.filterProductsBySearch();
      console.log("after string filter: ", this.filteredProducts);
    }
  }
  //Add selected tag to searched tags
  addTag(id:number){
    var tag = this.productService.getProductTagById(id);
    this.addToTags(1, tag);
    this.availableTags = this.availableTags.filter(t => t.Id !== id);
    this.filterProductsByTags();
  }
  //Remove selected tag to searched tags
  removeTag(id:number){
    var tag = this.productService.getProductTagById(id);
    this.addToTags(0, tag);
    this.selectedTags = this.selectedTags.filter(t => t.Id !== id);
    this.filterProductsByTags();
  }
  //Adds tag to appropriate collection, then sorts collection by ascending order
  addToTags(code:number, tag:ProductTag){
    if(code === 0){
      this.availableTags.push(tag);
      this.availableTags = this.availableTags.sort((a,b) => (a.Name > b.Name) ? 1 : -1);
    }
    else{
      this.selectedTags.push(tag);
      this.selectedTags = this.selectedTags.sort((a,b) => (a.Name > b.Name) ? 1 : -1);
    }
  }

}
