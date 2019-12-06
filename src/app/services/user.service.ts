import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IUser, IRole } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl = "http://localhost:4000/api/users"
  roleUrl = "http://localhost:4000/api/roles"

  constructor(private http:HttpClient) { }

  getAllUsers(): Observable<IUser[]>{
    return this.http.get<IUser[]>(this.userUrl).pipe(
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
