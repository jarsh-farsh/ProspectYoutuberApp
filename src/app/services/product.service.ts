import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ProductTag } from '../models/ProductTag';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, tap, map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IMG_UTILS, HTTP_UTILS } from '../utils/utilities';

@Injectable({
  providedIn: 'root'
})
export class ProductService{
  private productUrl = environment.apiUrl + 'products';
  private tagUrl = environment.apiUrl + 'tags';
  private productTagUrl = environment.apiUrl + 'producttags';
  private productImageUrl = environment.apiUrl + 'images';

  get canAddToCart(){
    return this.authService.isLoggedIn();
  }

  constructor(private authService: AuthService,
              private http: HttpClient) {

   }

  getProducts(getImages = false):Observable<any[]> {
    const params = new HttpParams().set('getImages', getImages.toString());
    return this.http.get<any[]>(this.productUrl, { params: params }).pipe(
      catchError(HTTP_UTILS.handleError)
    );
  } 

  getProductByid(id:number, getImages = false): Observable<any>{
    const params = new HttpParams().set('getImages', getImages.toString());
    return this.http.get<any>(this.productUrl+`/${id}`, { params: params }).pipe(
      catchError(HTTP_UTILS.handleError)
    );
  }

  getPopularProducts(): Observable<any> {
    return this.http.get<any>(this.productUrl + 'popular').pipe(
      catchError(HTTP_UTILS.handleError)
    );
  }

  populateProducts(data : any): Product[]{
    var productsData = data;
    var products: Product[] = productsData;
    return products;
  }

  getProductImageSrc(img: string): string{
    if(img) return environment.imagesUrl + img;
    return IMG_UTILS.NoImageAvailable();
  }

  getProductImageById(id): Observable<any>{
    return this.http.get<any>(this.productImageUrl+`/${id}`).pipe(
      catchError(HTTP_UTILS.handleError)
    )
  }

  addProduct(data: any): Observable<any>{
    return this.http.post(this.productUrl, data).pipe(
      catchError(HTTP_UTILS.handleError)
    )
  }

  updateProduct(data: any): Observable<any>{
    return this.http.put(this.productUrl, data).pipe(
      catchError(HTTP_UTILS.handleError)
    );
  }

  deleteProduct(data: any): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    }
    return this.http.delete(this.productUrl, options).pipe(
      catchError(HTTP_UTILS.handleError)
    )
  }

  isPopularProduct(product:Product): boolean {
    var popularProducts;
    return false;
  }
  
  getTags(): Observable<ProductTag[]> {
    return this.http.get<ProductTag[]>(this.tagUrl).pipe(
      catchError(HTTP_UTILS.handleError)
    );
  }

  getProductTags(): Observable<any[]> {
    return this.http.get<any[]>(this.productTagUrl).pipe(
      catchError(HTTP_UTILS.handleError)
    );
  }

  getProductTagByid(id:number): ProductTag {
    return null;
  }
}
