import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { HTTP_UTILS } from '../utils/utilities';
import { ProductData } from '../models/productData';


@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private orderUrl = environment.apiUrl + "orders";
    private orderItemUrl = environment.apiUrl + "orderItems";
    private productDataUrl = environment.apiUrl + "orderItems/product";

    constructor(private http: HttpClient){}

    getAllOrders(getItems = false):Observable<Order[]>{
        const params = new HttpParams().set('getItems', getItems.toString());
        return this.http.get<Order[]>(this.orderUrl, {params: params}).pipe(
            catchError(HTTP_UTILS.handleError)
        )
    }

    getProductData(id: number):Observable<ProductData[]>{
        return this.http.get<ProductData[]>(this.productDataUrl+`/${id}`).pipe(
            catchError(HTTP_UTILS.handleError)
        )
    }

    addOrder(data: any):Observable<any>{
        return this.http.post<any>(this.orderUrl, data).pipe(
            catchError(HTTP_UTILS.handleError)
        );
    }
}