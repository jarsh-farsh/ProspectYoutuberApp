import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { GlobalMessageService } from 'src/app/services/global-message.service';
import { IUser, IRole } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AdminDialogComponent } from './admin-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  id: number = 3;
  users: IUser[];
  searchedUser: IUser;
  shownUsers: IUser[];
  userPages: number[] = [];
  currentPage: number;
  userSearched: boolean = false;
  usernameSearched:string = '';

  roles: IRole[];
  availableRoles: IRole[] = [];
  selectedRole: IRole;

  constructor(private userService: UserService,
              private gmSerivce: GlobalMessageService,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
    this.init();
  }

  init(){
    this.searchedUser = null;
    this.users = [];
    this.userService.getAllUsers(true).subscribe({
      next: users => {
        this.populateUsers(users);
      },
      error: err => console.log(err)
    })
    this.userService.getAllRoles().subscribe({
      next: roles => {
        this.roles = roles.filter(r => r.type !== "Master");
      },
      error: err => console.log(err)
    })
  }

  populateUsers(users: IUser[]){
    this.users = users.filter(u => u.role.id !== 1);
    var userPagesLength = Math.floor(this.users.length / 10);
    if(Math.round(this.users.length / 10) >= 0){
      userPagesLength += 1;
    }
    if(userPagesLength !== 0)
    this.setUpPages(userPagesLength);
    this.currentPage = 1;
    this.setUpCurrentShownUsers();
  }

  setUpPages(length){
    this.userPages = [];
    for(var i = 1; i <= length; i++){
      this.userPages.push(i);
    }
  }

  setUpCurrentShownUsers(){
    var startIndex = (this.currentPage - 1)
    this.shownUsers = this.users.slice(startIndex, startIndex+10);
  }

  goToPage(index){
    this.currentPage = index+1;
    this.setUpCurrentShownUsers();
  }

  searchUser(){
    if(this.usernameSearched === ''){
      this.gmSerivce.addMessage("Please enter a username to search", "error");
      return;
    }
    var userFound = this.users.find(u => u.username === this.usernameSearched);
    if(!userFound){
      this.gmSerivce.addMessage("Username doesn't exists, please check the spelling and try again!", "error");
      return
    }
    this.setUpUser(userFound);
    
  }

  clearUser(){
    this.searchedUser = null;
    this.userSearched = false;
    this.availableRoles = [];
  }

  setUpUser(user: IUser){
    this.usernameSearched = '';
    this.searchedUser = user;
    this.userSearched = true;
    if(this.searchedUser.role.type === "User") {
      this.availableRoles = this.roles.filter(r => r.type !== "User");
    }
    else {
      this.availableRoles = this.roles.filter(r => r.type !== "Admin");
    }

  }

  confirmChoice(option: number, args: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    var title, description;
    if(option === 1){
      if(!args) {
        this.gmSerivce.addMessage("Please select a new role to change the user to.", "error");
        return;
      }
      title = "Confirm Permission Change"
      description = `Are you sure that you would like to change the permission for the user ${this.searchedUser.username} to ${args.type}?`;
    }else if(option === 2){
      title = "Confirm User Removed"
      description = `Are you sure that you would like to remove the user ${this.searchedUser.username}?`;
    }else{
      return;
    }
    
    dialogConfig.data = {
      title: title,
      description: description,
      user: this.searchedUser
    }

    const dialogRef = this.dialog.open(AdminDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: res => {
        if(res){
          if(option === 1){
            var userData = this.mapUser(args);
            this.userService.updateUser(userData).subscribe({
              next: data => {
                if(data.error){
                  this.gmSerivce.addMessage("There was an issue updating the user's permissions", "error");
                }else{
                  this.gmSerivce.addMessage("Successfully changed the users permissions.", "success");
                  this.clearUser();
                  this.init();
                }
              },
              error: err => {
                this.gmSerivce.addMessage("There was an issue updating the user's permissions", "error");
              }
            })
          }else{
            var userData = this.mapUser(null);
            console.log(userData);
            this.userService.deleteUser(userData).subscribe({
              next: data => {
                if(data.error){
                  this.gmSerivce.addMessage("There was an issue removing the user", "error");
                }else{
                  this.clearUser();
                  this.gmSerivce.addMessage("Successfully removed the user", "success");
                  this.init();
                }
              }
            })
          }
        }
      },
      error: err => {
        this.gmSerivce.addMessage("There was an issue. Sorry!", "error");
      }
    })
  }

  mapUser(args): any{
    var roleId
    if(args){
      roleId = args.id
    }else{
      roleId = this.searchedUser.role.id;
    }
    var data = {
      id: this.searchedUser.id,
      username: this.searchedUser.username,
      role_id: roleId,
      first_name: this.searchedUser.first_name,
      last_name: this.searchedUser.last_name
    }
    return data;
  }

}
