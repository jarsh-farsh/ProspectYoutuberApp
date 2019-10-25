import { Component, OnInit } from '@angular/core';
import { SocialMediaData } from 'src/app/services/social-media.service';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/models/user';

@Component({
  selector: 'pip-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  socialMediaLinks: string[];

  user: IUser;

  get currentUser():IUser{
    return this.authService.currentUser;
  }

  constructor(private smData: SocialMediaData,
              private authService: AuthService) { }

  ngOnInit() {
    this.socialMediaLinks = this.smData.getSMLinks();
  }

  isLoggedIn():boolean{
    if(this.user){
      return true;
    }

    return false;
  }
}
