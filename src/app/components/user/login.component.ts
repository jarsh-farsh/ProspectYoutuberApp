import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;

  constructor(private authSerivce: AuthService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })

    this.errorMessage = '';
  }

  confirmSignIn(){
    var username = this.loginForm.get('username').value;
    var password = this.loginForm.get('password').value



    this.authSerivce.login(username, password).subscribe({
      next: user => {
        console.log('User: ', user);
        if (!user) {
          this.errorMessage = 'Username and password are not correct';
        } else {
          if (this.authSerivce.redirectUrl) {
            this.router.navigateByUrl(this.authSerivce.redirectUrl);
          } else {
            this.router.navigate(['/home']);
          }
        }
      },
      error: err => {
        this.errorMessage = err;
        console.log('Failed to login');
      }
    })

  }
}
