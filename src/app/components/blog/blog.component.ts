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

  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.blogs = this.blogService.getAllBlogs();
    this.LatestBlog = this.blogService.getLatestBlog();
  }

}
