import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../../models/product';
import { SocialMediaData } from 'src/app/services/social-media.service';
import * as $ from 'jquery';
import { BlogService } from 'src/app/services/blog.service';
import { Blog } from '../../models/blog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  popularProducts: Product[] = [];
  latestBlog: Blog;
  errorMessage: any;

  get SocialMediaLinks(): string[]{
    return this.socialMedia.getSMLinks();
  }

  get canAddToCart(): boolean{
    return this.prodService.canAddToCart;
  }

  constructor(private prodService: ProductService,
              private blogService: BlogService,
              private socialMedia: SocialMediaData) { }

  ngOnInit() {
    this.prodService.getPopularProducts().subscribe({
      next: popularProds => this.popularProducts = popularProds,
      error: err => this.errorMessage = err
    });

    this.blogService.getLatestBlog().subscribe({
      next: blog => this.latestBlog = blog,
      error: err => this.errorMessage = err
    })
  }

  changeYPosition(event) {

    var buttonId = event.currentTarget.id;

    var target = null;
    var targetPos = null;

    if (buttonId === 'homeMerchBtn') {
      target = $("#merchSection");
    }

    if (buttonId === 'homeVideosBtn') {
      target = $("#videoSection");
    }

    if (buttonId === 'homeBlogBtn') {
      target = $("#blogSection");
    }

    if (target != null) {
      targetPos = target.position();

      $('html, body').animate({ scrollTop: targetPos.top }, 800)
    }

  }

}
