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

  get PopularProducts(){
    return this.productService.getPopularProducts();
  }

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: data => {  
        this.products = this.populateProducts(data);
        this.filteredProducts = this.products;
      },
      error: err => this.errorMessage = err
    });

    this.productService.getTags().subscribe({
      next: tags => this.populateTags(tags),
      error: err => this.errorMessage = err
    });

    this.productService.getProductTags().subscribe({
      next: productTags => this.populateProductTags(productTags),
      error: err => this.errorMessage = err
    })

    if(this.searchFilter === ''){
      this.filteredProducts = this.products;
    }else{
      this.filterProductsBySearch();
    }
  }

  populateProducts(data : any): Product[]{
    var productsData = data.products;
    var imageUrlsData = data.imageUrls;
    var products: Product[] = [];

    for(var i = 0; i < productsData.length; i++){
      var product = new Product();
      product = productsData[i];
      var test = imageUrlsData.filter(i => i.prod_id === product.id);
      for(var j = 0; j < test.length; j++){
        if(!product.image_url) product.image_url = [];
        let url = test[j].url;
        product.image_url.push(url);
      }
      products.push(product);
    }
    
    return products;
  }

  populateTags(data:any[]):void{
    for(var i = 0; i < data.length; i++){
      var newProdTag = new ProductTag();
      newProdTag.id = data[i].tagid;
      newProdTag.type = data[i].categoryname;
      newProdTag.name = data[i].tagname;
      this.productTags[i] = newProdTag;
      
    }
    this.availableTags = this.productTags;
    this.availableTags = this.availableTags.sort((a,b) => (a.name > b.name) ? 1 : -1);
  }

  populateProductTags(data:any[]):void{
    for(var i = 0; i < this.products.length; i++){
      var tags = data.filter(d => d.product_id == this.products[i].id);
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
