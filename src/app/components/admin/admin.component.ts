import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  tabSelected: number;

  get isMaster():boolean{
    return this.authService.isMaster();
  }

  constructor(private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    

    this.tabSelected;
  }

  changeActive(id:number){
    if(this.tabSelected === id) return;
    this.tabSelected = id;
  }

  isActive(id: number){
    return id === this.tabSelected;
  }

  onActivate(event: any){
    this.tabSelected = event.id;
  }

}
