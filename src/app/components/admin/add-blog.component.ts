import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';
import { Blog } from 'src/app/models/blog';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/user';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {

  blogForm: FormGroup;
  needConfirmationBlogs: Blog[];
  errorMessage: string;

  get isMaster():boolean{
    return this.authSerivce.isMaster();
  }

  constructor(private fb: FormBuilder,
              private authSerivce: AuthService,
              private blogService: BlogService,
              private userService: UserService) { }

  ngOnInit() {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]]      
    })

    this.updateConfirmedBlogs();
  }

  updateConfirmedBlogs(){
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.blogService.getAllUnconfirmedBlogs().subscribe({
          next: data => {
            this.populateBlogs(users, data);
          },
          error: err => this.errorMessage = err
        })
      },
      error: err => this.errorMessage = err
    })
  }

  populateBlogs(users: IUser[], data: any[]){
    var blogs: Blog[] = [];
    for(var i = 0; i < data.length; i++){
      var tmp = new Blog;
      tmp.id = data[i].id;
      tmp.title = data[i].title;
      tmp.body = data[i].body;
      tmp.confirmed = data[i].confirmed === 0 ? true : false;
      tmp.created_on = data[i].created_on;
      tmp.modified_on = data[i].modified_on;
      tmp.user = users.find(u => u.id == data[i].user_id);
      blogs.push(tmp);
    }
    this.needConfirmationBlogs = blogs;
    console.log(data);
  }

  submitBlog(){
    var confirmed = this.isMaster ? 0 : 1;
    var title = this.blogForm.get('title').value;
    var body = this.blogForm.get('body').value;
    var user = this.authSerivce.currentUser.id;

    var blog = { title: title, body: body, user_id: user, confirmed: confirmed}
    this.blogService.addBlog(blog).subscribe({
      next: data => {
        if(data.error){
          console.error("There was an error adding blog: ", + data.error);
        }else{
          console.log("It worked!");
          this.updateConfirmedBlogs();
          this.blogForm.reset();
        }
      },
      error: err => this.errorMessage = err
    })

  }
}
