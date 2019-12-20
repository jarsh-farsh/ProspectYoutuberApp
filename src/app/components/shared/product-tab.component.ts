import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'prod-tab',
    templateUrl: './product-tab.component.html',
    styleUrls: ['./product-tab.component.css']
})

export class ProductTabComponent implements OnInit{
    @Input() product: Product;

    message:string;

    productForm: FormGroup;
    errorMessage: any;

    get canAddToCart(): boolean{
        return this.prodService.canAddToCart;
    }

    constructor(private prodService: ProductService,
                private cartService: CartService,
                private fb: FormBuilder){
    }

    ngOnInit(): void {
        this.productForm = this.fb.group({
            quantity: ['', [Validators.required]]
        })
        this.message = '';
    }
    
    getProductImage(product: Product){
        if(product && product.image_url.length > 0){
            return environment.imagesUrl + product.image_url[0]
        }
        return environment.imagesUrl + 'no-picture.jpg'
    }

    isPopularProduct(product: Product):boolean{
        return this.prodService.isPopularProduct(product);
    }

    addToCart(product: Product): void{      
        var quantity = this.productForm.get('quantity').value;    
        this.cartService.AddItem(product, quantity);
    }
}