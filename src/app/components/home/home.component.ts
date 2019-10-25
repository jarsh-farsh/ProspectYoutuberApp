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

  get PopularProducts(): Product[]{
    return this.products.getPopularProducts();
  }

  get SocialMediaLinks(): string[]{
    return this.socialMedia.getSMLinks();
  }

  get LatestBlog(): Blog{
    return this.blogs.getLatestBlog();
  }

  constructor(private products: ProductService,
              private blogs: BlogService,
              private socialMedia: SocialMediaData) { }

  ngOnInit() {

  }

  changeYPosition(event) {

    var buttonId = event.currentTarget.id;
    console.log("Test: ", event.currentTarget);

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
      console.log("Target Position: ", targetPos.top);

      $('html, body').animate({ scrollTop: targetPos.top }, 800)
    }

  }

}
