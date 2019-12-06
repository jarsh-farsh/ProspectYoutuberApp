import { Injectable } from '@angular/core';
import { Blog, Comment } from '../models/blog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map, filter } from 'rxjs/operators';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  blogUrl = environment.apiUrl + "blogs";
  commentUrl = environment.apiUrl + "comments";
  blogCommentUrl = environment.apiUrl + "blogcomments"

  constructor(private http: HttpClient) { }

  getAllBlogs(): Observable<any[]> {
    return this.http.get<any[]>(this.blogUrl).pipe(
      map(res => {
        var blogs = res.filter(b => b.confirmed === 0)
        return blogs
      }),
      catchError(this.handleError)
    )
  }

  getAllUnconfirmedBlogs(getUsers = false): Observable<any[]> {
    return this.http.get<any[]>(this.blogUrl).pipe(
      map(res => {
        var blogs = res.filter(b => b.confirmed === 1)
        return blogs
      }),
      catchError(this.handleError)
    )
  }

  getBlogById(id: number): Observable<Blog>{
    return this.http.get<Blog>(this.blogUrl+`/${id}`)
    .pipe(
      map(res => res[0]),
      catchError(this.handleError)
    )
  }

  getLatestBlog(): Observable<Blog>{
    return this.http.get<Blog[]>(this.blogUrl)
    .pipe(
      map(res => res[res.length-1]),
      catchError(this.handleError)
    )
  }

  addBlog(blog: any): Observable<any> {
    return this.http.post(this.blogUrl, blog).pipe(
      catchError(this.handleError)
    )
  } 

  updateBlog(blog: any): Observable<any> {
    return this.http.put(this.blogUrl, blog).pipe(
      catchError(this.handleError)
    )
  }

  deleteBlog(blog: any): Observable<any>{
    return this.http.delete(this.blogUrl, blog).pipe(
      catchError(this.handleError)
    )
  }

  getAllComments(): Observable<Comment[]>{
    return this.http.get<Comment[]>(this.commentUrl).pipe(
      catchError(this.handleError)
    );
  }

  addComment(comment: any): Observable<any>{
    return this.http.post(this.commentUrl, comment).pipe(
      catchError(this.handleError)
    );
  }

  getAllBlogComments(blogId: number): Observable<any[]> {
    return this.http.get<any[]>(this.blogCommentUrl+`/${blogId}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteComment(id: number):Observable<any>{
    return this.http.delete(this.commentUrl+`/${id}`).pipe(
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
