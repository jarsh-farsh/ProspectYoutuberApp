import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { GlobalMessageService } from 'src/app/services/global-message.service';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null{
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if(emailControl.pristine || confirmControl.pristine){
    return null;
  }

  if(emailControl.value === confirmControl.value){
    return null;
  }
  return { 'match': true };
}

function passwordMatcher(c: AbstractControl): { [key: string]: boolean } | null{
  const passwordControl = c.get('password');
  const confirmControl = c.get('confirmPassword');

  if(passwordControl.pristine || confirmControl.pristine){
    return null;
  }

  if(passwordControl.value === confirmControl.value){
    return null;
  }
  return { 'match': true };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;
  formError: string;

  constructor(private fb:FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private gmSerivce: GlobalMessageService,
              private router: Router) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(12)]],
      lastName: ['',[Validators.required, Validators.maxLength(12)]],
      emailGroup: this.fb.group({
        email:['', [Validators.required, Validators.email]],
        confirmEmail:['', [Validators.required,
                           Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]]
      }, {validator: emailMatcher}),
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.maxLength(25)]],
        confirmPassword: ['', [Validators.required, Validators.maxLength(25)]]
      }, {validator: passwordMatcher})
    })
  }

  confirmSignUp(): void{
    var user = {first_name: this.signupForm.get('firstName').value, 
                last_name: this.signupForm.get('lastName').value,
                username: this.signupForm.get('emailGroup').get('email').value,
                password: this.signupForm.get('passwordGroup').get('password').value,
                role_id: 3};

    this.userService.addUser(user).subscribe({
      next: data =>{
        if(data.error){
          this.formError = data.message;
        }else{
          this.authService.login(user.username, user.password).subscribe({
            next: user => {
              if(!user){
                this.formError = "There was an error logging in your new account! Oops!";
              }else{
                if (this.authService.redirectUrl) {
                  this.router.navigateByUrl(this.authService.redirectUrl);
                } else {
                  this.router.navigate(['/home']);
                }
              }
            }
          });
        }
      },
      error: err => this.errorMessage = err
    })
  }

}
