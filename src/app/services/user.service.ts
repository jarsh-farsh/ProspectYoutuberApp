import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IUser, IRole } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl = environment.apiUrl + "users"
  roleUrl =  environment.apiUrl + "roles"

  constructor(private http:HttpClient) { }

  getAllUsers(getRoles = false): Observable<IUser[]>{
    const params = new HttpParams().set('getRoles', getRoles.toString());
    
    return this.http.get<IUser[]>(this.userUrl, {params: params}).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id:number):Observable<IUser>{
    return this.http.get<IUser>(this.userUrl+`/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addUser(user:any):Observable<any>{
    return this.http.post<any>(this.userUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(user:any):Observable<any>{
    return this.http.put(this.userUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(user:any):Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: user
    }
    return this.http.delete(this.userUrl, options).pipe(
      catchError(this.handleError)
    );
  }

  removeUser(user:any):Observable<any>{
    return this.http.delete(this.userUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  getAllRoles():Observable<IRole[]>{
    return this.http.get<IRole[]>(this.roleUrl).pipe(
      catchError(this.handleError)
    );
  }

  getRoleById(id:number):Observable<IRole>{
    return this.http.get<IRole>(this.roleUrl+`/${id}`).pipe(
      catchError(this.handleError)
    );
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
