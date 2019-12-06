import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  get isMaster():boolean{
    return this.authService.isMaster();
  }

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    if(!this.authService.isAdmin){
      this.router.navigate(['/home']);
    }
  }

}
