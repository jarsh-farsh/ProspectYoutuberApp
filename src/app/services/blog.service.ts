import { Injectable } from '@angular/core';
import { Blog, Comment } from '../models/blog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map, filter } from 'rxjs/operators';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { HTTP_UTILS } from '../utils/utilities';

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
      catchError(HTTP_UTILS.handleError)
    )
  }

  getAllUnconfirmedBlogs(getUsers = false): Observable<any[]> {
    return this.http.get<any[]>(this.blogUrl).pipe(
      map(res => {
        var blogs = res.filter(b => b.confirmed === 1)
        return blogs
      }),
      catchError(HTTP_UTILS.handleError)
    )
  }

  getBlogById(id: number): Observable<Blog>{
    return this.http.get<Blog>(this.blogUrl+`/${id}`)
    .pipe(
      map(res => res[0]),
      catchError(HTTP_UTILS.handleError)
    )
  }

  getLatestBlog(): Observable<Blog>{
    return this.http.get<Blog[]>(this.blogUrl)
    .pipe(
      map(res => res[res.length-1]),
      catchError(HTTP_UTILS.handleError)
    )
  }

  addBlog(blog: any): Observable<any> {
    return this.http.post(this.blogUrl, blog).pipe(
      catchError(HTTP_UTILS.handleError)
    )
  } 

  updateBlog(blog: any): Observable<any> {
    return this.http.put(this.blogUrl, blog).pipe(
      catchError(HTTP_UTILS.handleError)
    )
  }

  deleteBlog(blog: any): Observable<any>{
    return this.http.delete(this.blogUrl, blog).pipe(
      catchError(HTTP_UTILS.handleError)
    )
  }

  getAllComments(): Observable<Comment[]>{
    return this.http.get<Comment[]>(this.commentUrl).pipe(
      catchError(HTTP_UTILS.handleError)
    );
  }

  addComment(comment: any): Observable<any>{
    return this.http.post(this.commentUrl, comment).pipe(
      catchError(HTTP_UTILS.handleError)
    );
  }

  getAllBlogComments(blogId: number): Observable<any[]> {
    return this.http.get<any[]>(this.blogCommentUrl+`/${blogId}`).pipe(
      catchError(HTTP_UTILS.handleError)
    );
  }

  deleteComment(id: number):Observable<any>{
    return this.http.delete(this.commentUrl+`/${id}`).pipe(
      catchError(HTTP_UTILS.handleError)
    );
  }
}
