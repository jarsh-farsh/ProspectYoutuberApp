import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';
import { Subscription } from 'rxjs';
import { Blog, Comment } from 'src/app/models/blog';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BlogDialogComponent } from './blog-dialog.component';
import { GlobalMessageService } from 'src/app/services/global-message.service';

@Component({
  selector: 'app-blog-entry',
  templateUrl: './blog-entry.component.html',
  styleUrls: ['./blog-entry.component.css']
})
export class BlogEntryComponent implements OnInit {

  private sub: Subscription;
  commentForm: FormGroup;
  
  blog: Blog;
  comments: Comment[] = [];

  addingComment: boolean;
  errorMessage: string;
  reviewing: boolean;

  get blogCommentCount(): number{
    if(this.blog && this.blog.comments) return this.blog.comments.length;
  }

  get currentUser(): IUser{
    return this.authService.currentUser;
  }

  constructor(private fb: FormBuilder,
              private aRouter: ActivatedRoute,
              private router: Router,
              private blogService: BlogService,
              private authService: AuthService,
              private userService: UserService,
              private gmService: GlobalMessageService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.sub = this.aRouter.paramMap.subscribe(
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
    this.blogService.getBlogById(id).subscribe({
      next: (blog:any) => {
        this.blog = blog;
        this.blog.comments = [];
        this.getComments();
        this.getUser(blog.user_id);
      },
      error: err => this.errorMessage = err
    });
  }

  getUser(id:number){
    this.userService.getUserById(id).subscribe({
      next: user => {
        this.blog.user = user
      },
      error: err => this.errorMessage = err
    })
  }

  getComments(){
    this.blogService.getAllComments().subscribe({
      next: comments => {
        this.blogService.getAllBlogComments(this.blog.id).subscribe({
          next: blogComments => {
            this.userService.getAllUsers().subscribe({
              next: users =>{
                this.populateComments(comments, blogComments, users)
              },
              error: err => this.errorMessage = err
            })
          },
          error: err => this.errorMessage = err
        })
      },  
      error: err => this.errorMessage = err
    })
  }

  populateComments(comments: any[], blogComments: any[], users: any[]){
    var collection: Comment[] = [];
    for(var i = 0; i < blogComments.length; i++){
      var tmp = comments.find(c => c.id === blogComments[i].comment_id);
      var user = users.find(u => u.id === tmp.user_id);

      var tmpComment = new Comment();
      tmpComment.id = tmp.id;
      tmpComment.created_on = tmp.created_on;
      tmpComment.modified_on = tmp.modified_on;
      tmpComment.body = tmp.body;
      tmpComment.user = user;
      collection.push(tmpComment);
    }

    this.blog.comments = collection;
    if(this.currentUser && 
       this.blog.comments.length > 0) this.sortUserComments();
  }

  sortUserComments(){
    var tmp1 = this.blog.comments.filter(c => c.user.id === this.currentUser.id);
    var tmp2 = this.blog.comments.filter(c => c.user.id !== this.currentUser.id);
    this.blog.comments = tmp1.concat(tmp2);
  }

  toggleCommentAdd(): void{
    if(!this.addingComment){
      this.addingComment = true;
    }else{
      this.addingComment = false;
    }
  }

  submitComment():void{
    var commentBody = this.commentForm.get('body').value;
    var blog = this.blog.id;
    var comment = {user_id: this.currentUser.id, body: commentBody, created_on: "", modified_on: ""};
    var body = {blog_id: blog, comment: comment};

    this.blogService.addComment(body).subscribe({
      next: data => {
        this.getComments()
      },
      error: err => this.errorMessage = err

    });

    this.commentForm.reset();
  }

  confirmDeleteBlog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      isBlogDelete: true
    }

    const dialogRef = this.dialog.open(BlogDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      choice => {
        if(choice === true){
          this.blogService.deleteBlog(this.blog).subscribe({
            next: res =>{
              if(!res.error){
                this.gmService.addMessage('Successfully deleted blog entry', 'success');
                this.router.navigate(['/admin']);
              }
              this.gmService.addMessage('There was an issue deleting blog entry', 'error');
            }
          })
        }
      }
    )
  }

  confirmEditBlog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      isBlogEdit: true,
      title: this.blog.title,
      body: this.blog.body
    }

    const dialogRef = this.dialog.open(BlogDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if(data.choice === true){
          var blog = { id: this.blog.id, title: data.title, body: data.body, confirmed: 1 }
          this.blogService.updateBlog(blog).subscribe({
            next: res => {
              if(!res.error){
                this.getBlog(this.blog.id);
                this.gmService.addMessage('Successfully updated blog', 'success');
              }else{
                this.gmService.addMessage('There was an issue updating blog', 'error');
              }
            },
            error: err => this.errorMessage = err
          })
        }
      }
    )
  }

  confirmBlog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      isBlogConfirm: true
    }

    const dialogRef = this.dialog.open(BlogDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      choice => {
        if(choice === true){
          var blog = { id: this.blog.id, title: this.blog.title, body: this.blog.body, confirmed: 0 };
          this.blogService.updateBlog(blog).subscribe({
            next: res => {
              if(!res.error){
                this.gmService.addMessage('Blog has been confirmed, you can see it now on the blog page', 'info')
                this.router.navigate(['/admin'])
              }
              this.gmService.addMessage('There was an error confirming the blog', 'error')
            },
            error: err => this.errorMessage = err
          })
        }
      }
    )
  }

  confirmDelete(id: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      isComment: true
    }

    const dialogRef = this.dialog.open(BlogDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      choice => {
        if(choice === true){
          this.deleteComment(id);
        }
      }
    )
  }

  deleteComment(id: number){
    this.blogService.deleteComment(id).subscribe({
      next: data => this.getComments(),
      error: err => this.errorMessage = err
    });
  }

}
