import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';
import { Subscription } from 'rxjs';
import { Blog, Comment } from 'src/app/models/blog';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/models/user';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-blog-entry',
  templateUrl: './blog-entry.component.html',
  styleUrls: ['./blog-entry.component.css']
})
export class BlogEntryComponent implements OnInit {

  private sub: Subscription;
  commentForm: FormGroup;
  
  blog: Blog;

  addingComment: boolean;

  get blogComments() : Comment[]{
    return this.blogService.getAllBlogComments(this.blog.Id);
  }

  get blogCommentCount(): number{
    return this.blogService.getBlogCommentCount(this.blog.Id);
  }

  get currentUser(): IUser{
    return this.authService.currentUser;
  }

  constructor(private fb: FormBuilder,
              private router: ActivatedRoute,
              private blogService: BlogService,
              private authService: AuthService) { }

  ngOnInit() {
    this.sub = this.router.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getBlog(id);
      }
    )

    this.addingComment = false;

    this.commentForm = this.fb.group({
      body: ['', 
          [Validators.required, 
           Validators.maxLength(250)]
          ]
    });
  }
  

  ngOnDestroy(): void{
    this.sub.unsubscribe();
  }

  getBlog(id:number): void{
    this.blog = this.blogService.getBlogById(id);
  }

  toggleCommentAdd(): void{
    if(!this.addingComment){
      this.addingComment = true;
    }else{
      this.addingComment = false;
    }
  }

  submitComment():void{
    //TODO add comment
  }

}
