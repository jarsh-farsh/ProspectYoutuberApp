import { Component, OnInit } from '@angular/core';
import { SocialMediaData } from 'src/app/services/social-media.service';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/models/user';
import { Router } from '@angular/router';
import { GlobalMessageService } from 'src/app/services/global-message.service';
import { GlobalMessage } from 'src/app/models/globalMessage';

@Component({
  selector: 'app-pip-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  socialMediaLinks: string[];

  get currentUser():IUser{
    return this.authService.currentUser;
  }

  get isLoggedIn(): boolean{
    return this.authService.isLoggedIn();
  }

  get globalMessages(): GlobalMessage[] {
    return this.globMsgService.messages;
  }

  constructor(private smData: SocialMediaData,
              private authService: AuthService,
              private globMsgService: GlobalMessageService,
              private router: Router) { }

  ngOnInit() {
    this.socialMediaLinks = this.smData.getSMLinks();
  }

  Logout(){
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  canAccessAdmin(){
    if(this.authService.isMaster()) return true;
    if(this.authService.isAdmin()) return true;

    return false;
  }
}
