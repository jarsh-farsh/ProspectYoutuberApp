import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ProductTag } from '../models/ProductTag';
import { all } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ProductService{

  constructor() {

   }

  Products: Product[] = 
    [
      {
        Id: 0,
        Name: 'Plain Shirt',
        ProductCode: 'abc-0001',
        ImageUrl: 'assets/images/merch-plain-shirt.png',
        Price: 29.99,
        Description: "A nice plain shirt for somebody that just doesn't care about style. 100% Cotton",
        Tags: [7,5],
        QuantityInStock: 25,
        QuantitySold: 22
      },
      {
        Id: 1,
        Name: 'Fancy Shirt',
        ProductCode: 'abc-0002',
        ImageUrl: 'assets/images/merch-fancy-shirt.png',
        Price: 39.99,
        Description: "A comfy cotton shirt with a nice design made by some indie artist. 100% Cotton",
        Tags: [7,5],
        QuantityInStock: 15,
        QuantitySold: 32
      },
      {
        Id: 2,
        Name: 'Skull Hoodie',
        ProductCode: 'abd-0001',
        ImageUrl: 'assets/images/merch-hoodie.png',
        Price: 49.99,
        Description: "This hoodie has a sweet skull drawn on it. Very thick and warm!",
        Tags: [1,5,6],
        QuantityInStock: 5,
        QuantitySold: 12
      },
      {
        Id: 3,
        Name: 'Charm Hoodie',
        ProductCode: 'abd-0002',
        ImageUrl: 'assets/images/merch-hoodie.png',
        Price: 49.99,
        Description: "This hoodie has a four leaf clover on it! It may just bring you luck! Well, maybe not, but at least it will keep you warm.",
        Tags: [1,5,6],
        QuantityInStock: 25,
        QuantitySold: 3
      },
      {
        Id: 4,
        Name: 'Stripe Socks',
        ProductCode: 'abe-0001',
        ImageUrl: 'assets/images/merch-socks.png',
        Price: 19.99,
        Description: "Some striped socks to provide some much needed fashion to your feet!",
        Tags: [3,5,6],
        QuantityInStock: 55,
        QuantitySold: 32
      },
      {
        Id: 5,
        Name: 'Logo Pin',
        ProductCode: 'abf-0001',
        ImageUrl: 'assets/images/merch-pin.png',
        Price: 4.99,
        Description: "A pin with the channels logo on it. Show your support for the channel!",
        Tags: [2,5,6],
        QuantityInStock: 95,
        QuantitySold: 212
      }]

  ProductTags: ProductTag[] = [
    {
      Id: 7,
      Type: "Clothing",
      Name: "Shirt"
    },
    {
      Id: 1,
      Type: "Clothing",
      Name: "Hoodie"
    },
    {
      Id: 2,
      Type: "Clothing",
      Name: "Pin"
    },
    {
      Id: 3,
      Type: "Clothing",
      Name: "Socks"
    },
    {
      Id: 4,
      Type: "Clothing",
      Name: "Pants"
    },
    {
      Id: 5,
      Type: "Gender",
      Name: "Male"
    },
    {
      Id: 6,
      Type: "Gender",
      Name: "Female"
    }
  ]

  getProducts(): Product[] {
    return this.Products;
  } 

  getProductById(id:number): Product{
    return this.Products.find(p => p.Id === id);
  }

  getPopularProducts(): Product[] {
    return this.Products.sort(function (obj1, obj2) {
      return (obj1.QuantitySold < obj2.QuantitySold) ? 1 : -1;
    }).slice(0, 3);
  }

  isPopularProduct(product:Product): boolean {
    return (this.getPopularProducts().filter(p => p.Id === product.Id).length > 0);
  }
  
  getProductTags(): ProductTag[] {
    return this.ProductTags;
  }

  getProductTagById(id:number): ProductTag {
    return this.ProductTags.find(t => t.Id === id);
  }
}
