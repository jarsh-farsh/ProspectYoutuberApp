import { Injectable, TestabilityRegistry } from '@angular/core';
import { IUser, IRole } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _currentUser: IUser;
  get currentUser(){
    return this._currentUser;
  }
  set currentUser(user:IUser){
    this._currentUser = user;
  }

  Users: IUser[] = 
  [{
      Id: 0,
      Role: 0,
      Username: "tester@gmail.com",
      Password: "password",
      Email: "tester@gmail.com",
      First_name: "Tester",
      Last_name: "Bester"
    },
    {
      Id: 1,
      Role: 1,
      Username: "atester@gmail.com",
      Password: "password",
      Email: "atester@gmail.com",
      First_name: "Tester",
      Last_name: "Bester"
    }]  
  Roles: IRole[] = 
  [{
      Id: 0,
      Type: "User"
    },
    {
      Id: 1,
      Type: "Admin"
    }]

  constructor() { }

  login(username:string, password:string): boolean{
    var user = this.Users.find(u => u.Username == username && u.Password == password);
    if(user){
      this.currentUser = user;
      return true;
    }

    return false;
  }

  logout():void{
    if(this.currentUser){
      this.currentUser = null;
    }
  }

  getUserById(id: number): IUser{
    var user = this.Users.find(u => u.Id === id);
    if(user){
      return user;
    }

    return null;
  }
}
