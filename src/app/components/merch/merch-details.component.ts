import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { IMG_UTILS } from 'src/app/utils/utilities';

@Component({
  selector: 'app-product-details',
  templateUrl: './merch-details.component.html',
  styleUrls: ['./merch-details.component.css']
})
export class MerchDetailsComponent implements OnInit {
  private sub: Subscription;
  productForm: FormGroup;

  product: Product;
  errorMessage: string;

  selectedImgIndex: number;

  get MainProdImage(): string{
    return environment.imagesUrl + this.product.image_url[0];
  }

  getProduct(id:number): void {
    this.productService.getProductByid(id).subscribe({
      next: data => {
        this.product = this.populateProduct(data);
      },
      error: err => this.errorMessage = err
    });
  }

  constructor(private router: ActivatedRoute,
              private productService: ProductService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.sub = this.router.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getProduct(id);
      }
    )

    this.selectedImgIndex = 0;

    this.productForm = this.fb.group({
      quantity: ['', [Validators.required]]
    })

  }

  ngOnDestroy(): void{
    this.sub.unsubscribe();
  }

  populateProduct(data: any): Product{
    var product = new Product();
    product = data.product;
    var urls = Object.keys(data.imageUrls).map(i => data.imageUrls[i]);
    for(var i = 0; i < urls.length; i++){
      if(!product.image_url) product.image_url = [];
      product.image_url.push(urls[i].url);
    }

    return product;
  }

  ProdImage(index: number){

    return environment.imagesUrl + this.product.image_url[index];
    
  }

  addToCart(id:number): void{
    
  }

}
