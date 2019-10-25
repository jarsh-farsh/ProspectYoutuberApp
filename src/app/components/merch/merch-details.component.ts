import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './merch-details.component.html',
  styleUrls: ['./merch-details.component.css']
})
export class MerchDetailsComponent implements OnInit {
  private sub: Subscription;

  product: Product;

  getProduct(id:number): void {
    this.product = this.productService.getProductById(id);
  }

  constructor(private router: ActivatedRoute,
              private productService: ProductService) { }

  ngOnInit() {
    this.sub = this.router.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getProduct(id);
      }
    )
  }

  ngOnDestroy(): void{
    this.sub.unsubscribe();
  }

}
