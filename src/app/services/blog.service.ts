import { Injectable } from '@angular/core';
import { Blog, Comment } from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  Blogs: Blog[] = 
      [{
        Id: 0,
        Created_by: 1,
        Title: "Welcome!",
        Body: "Hello everybody! Welcome to my new pad! I sure hope you like it. I hoped that this website would help me to not only sell merch and push my brand, but to also help keep you guys up to date with whats going on. Thanks for stopping by!",
        Created_at: new Date("2019-10-10"),
        Modified_on: new Date("2019-10-10"),
        Comments: []
      }]
  
  comments: Comment[] =[
    {
      Id:0,
      User: 1,
      body: "Oh, hi there!",
      created_at: new Date(),
      modified_on: new Date()
    }
  ]

  constructor() { }

  getAllBlogs(): Blog[] {
    return this.Blogs;
  }

  getBlogById(id: number): Blog{
    return this.Blogs.find(b => b.Id === id);
  }

  getLatestBlog(): Blog{
    return this.Blogs[this.Blogs.length-1];
  }

  getAllBlogComments(blogId: number): Comment[] {
    var comments:Comment[];
    var blog = this.Blogs.find(b => b.Id === blogId);
    if(blog){    
      for(var i = 0; i<blog.Comments.length; i++){
        comments.push(this.comments.find(c => c.Id === blog.Comments[i]));
      }
    }

    return comments;
  }

  getBlogCommentCount(blogId: number): number{
    return this.Blogs.find(b => b.Id === blogId).Comments.length;
  }

}
