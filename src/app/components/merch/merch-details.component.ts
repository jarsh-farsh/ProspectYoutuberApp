import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { IMG_UTILS } from 'src/app/utils/utilities';
import { GlobalMessageService } from 'src/app/services/global-message.service';
import { CartService } from 'src/app/services/cart.service';

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

  getProduct(id:number): void {
    this.productService.getProductByid(id, true).subscribe({
      next: data => {
        this.product = data;
        if(this.product === null){
          this.gmService.addMessage("The page you wandered to doesn't exist. Strange...", 'info');
          this.router.navigate(['/merch']);
        }
      },
      error: err => this.errorMessage = err
    });
  }

  constructor(private activatedRouter: ActivatedRoute,
              private router: Router,
              private productService: ProductService,
              private gmService: GlobalMessageService,
              private cartService: CartService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.sub = this.activatedRouter.paramMap.subscribe(
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

  GetProductImage(index: number){
    if(this.product.image_url[index]){
      return IMG_UTILS.GetImageUrl(this.product.image_url[index]);  
    } else return IMG_UTILS.NoImageAvailable();
  }

  ImageError(index: number){
    this.product.image_url[index] = IMG_UTILS.NoImageAvailable();
  }

  selectImg(i){
    this.selectedImgIndex = i;
  }

  addToCart(): void{
    var quantity = this.productForm.get('quantity').value;
    if(quantity > 0){
      this.cartService.AddToCart(this.product, quantity);
    }else{
      this.gmService.addMessage("Quantity needs to be selected.", "info");
    }
  }

}
