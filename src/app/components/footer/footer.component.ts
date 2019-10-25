import { Component, OnInit } from '@angular/core';
import { SocialMediaData } from 'src/app/services/social-media.service';

@Component({
  selector: 'pip-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  socialMediaLinks: string[];

  constructor(private smData: SocialMediaData) { }

  ngOnInit() {
    this.socialMediaLinks = this.smData.getSMLinks();
  }

}
