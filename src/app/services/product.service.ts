import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ProductTag } from '../models/ProductTag';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, tap, map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService{
  private productUrl = environment.apiUrl + 'products';
  private tagUrl = environment.apiUrl + 'tags';
  private productTagUrl = environment.apiUrl + 'producttags';

  get canAddToCart(){
    return this.authService.isLoggedIn();
  }

  constructor(private authService: AuthService,
              private http: HttpClient) {

   }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.productUrl).pipe(
      catchError(this.handleError)
    );
  } 

  getProductByid(id:number): Observable<any>{
    return this.http.get<any>(this.productUrl+`/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getPopularProducts(): Observable<any> {
    return this.http.get<any>(this.productUrl + 'popular').pipe(
      catchError(this.handleError)
    );
  }

  isPopularProduct(product:Product): boolean {
    var popularProducts;
    return false;


  }
  
  getTags(): Observable<ProductTag[]> {
    return this.http.get<ProductTag[]>(this.tagUrl).pipe(
      catchError(this.handleError)
    );
  }

  getProductTags(): Observable<any[]> {
    return this.http.get<any[]>(this.productTagUrl).pipe(
      catchError(this.handleError)
    );
  }

  getProductTagByid(id:number): ProductTag {
    return null;
  }

  private handleError(err: HttpErrorResponse){
    let errorMessage = '';
    if(err.error instanceof ErrorEvent){
      errorMessage = `An error occurred: ${err.error.message}`;
    }else{
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
