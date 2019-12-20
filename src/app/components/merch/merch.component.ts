import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
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

  errorMessage:string;

  productLoading: boolean;
  productTagLoading: boolean;

  get PopularProducts(){
    return this.productService.getPopularProducts();
  }

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts(true).subscribe({
      next: data => {  
        this.productLoading = true;
        this.products = this.productService.populateProducts(data);
        this.filteredProducts = this.products;    
        if(this.searchFilter === ''){
          this.filteredProducts = this.products;
        }else{
          this.filterProductsBySearch();
        }
      },
      error: err => this.errorMessage = err,
      complete: () => this.productLoading = false
    });

    this.productService.getTags().subscribe({
      next: tags => {
        this.productTagLoading = true;
        this.populateTags(tags);
        this.productService.getProductTags().subscribe({
          next: productTags => this.populateProductTags(productTags),
          error: err => this.errorMessage = err
        })
      },
      error: err => this.errorMessage = err,
      complete: () => this.productTagLoading = false
    });


  }

  populateTags(data:any[]):void{
    this.productTags = data;

    this.availableTags = this.productTags;
    this.availableTags = this.availableTags.sort((a,b) => (a.name > b.name) ? 1 : -1);
  }

  populateProductTags(data:any[]):void{
    for(var i = 0; i < this.products.length; i++){
      var tags = data.filter(d => d.prod_id == this.products[i].id);
      for(var j = 0; j < tags.length; j++){
        if(!this.products[i].Tags) this.products[i].Tags = [];
        this.products[i].Tags.push(tags[j].tag_id);
      }
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
      this.filteredProducts = this.products.filter(p => p.name.toLocaleLowerCase().indexOf(this.searchFilter) !== -1);
    }else{
      this.filteredProducts = this.filteredProducts.filter(p => p.name.toLocaleLowerCase().indexOf(this.searchFilter) !== -1);
    }
  }
  //Filters products by selected search tags
  filterProductsByTags(){
    //Checks to see if there are any search parameters, if not set filtered products to all products
    if (this.selectedTags.length === 0) {
      this.filteredProducts = this.products;
    }

    //Iterate through selected tags and find the products with matching tags
    if (this.selectedTags.length > 0) {
      var newFiltered: Product[] = [];
      console.log("Selected tag length: ", this.selectedTags.length);
      for (var i = 0; i < this.selectedTags.length; i++) {
        console.log("i: ", i);
        if(i === 0){
          newFiltered = this.products.filter(p => p.Tags.find(t => t === this.selectedTags[i].id));
        }else{
          var tmp = this.products.filter(p => p.Tags.find(t => t === this.selectedTags[i].id));
          if (tmp.length > 0) {
            for (var j = 0; j < tmp.length; j++) {
              if (!newFiltered.find(p => p === tmp[j])) {
                newFiltered.push(tmp[j]);
              }
            }
          }
          
        }
      }
      newFiltered.sort((a,b) => (a.name > b.name) ? 1 : -1);
      this.filteredProducts = newFiltered;
    }

    //If tags have been applied or removed, check to see if selected products match the string input search
    if (this.searchFilter != '' && this.filteredProducts.length !== 0) {
      this.filterProductsBySearch();
    }
  }
  //Add selected tag to searched tags
  addTag(id:number){
    var tag = this.productTags.find(t => t.id === id);
    console.log("Tag: ", tag);
    this.addToTags(1, tag);
    this.availableTags = this.availableTags.filter(t => t.id !== id);
    this.filterProductsByTags();
  }
  //Remove selected tag to searched tags
  removeTag(id:number){
    var tag = this.productTags.find(t => t.id === id);
    this.addToTags(0, tag);
    this.selectedTags = this.selectedTags.filter(t => t.id !== id);
    this.filterProductsByTags();
  }
  //Adds tag to appropriate collection, then sorts collection by ascending order
  addToTags(code:number, tag:ProductTag){
    if(code === 0){
      this.availableTags.push(tag);
      console.log(this.availableTags);
      this.availableTags = this.availableTags.sort((a,b) => (a.name > b.name) ? 1 : -1);
    }
    else{
      this.selectedTags.push(tag);
      this.selectedTags = this.selectedTags.sort((a,b) => (a.name > b.name) ? 1 : -1);
    }
  }

}
