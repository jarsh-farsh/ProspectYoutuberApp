import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Blog } from 'src/app/models/blog';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blogs: Blog[];
  LatestBlog: Blog;
  errorMessage: any;

  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.blogService.getAllBlogs().subscribe({
      next: blogs => {
        this.blogs = blogs;
        this.LatestBlog = this.blogs[this.blogs.length-1]
      },
      error: err => this.errorMessage = err
    });


  }

}
