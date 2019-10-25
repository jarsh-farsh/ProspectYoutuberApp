import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private fb:FormBuilder,
              private authSerivce: AuthService) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(12)]],
      lastName: ['',[Validators.required, Validators.maxLength(12)]],
      emailGroup: this.fb.group({
        email:['', [Validators.required, Validators.email]],
        confirmEmail:['', [Validators.required, Validators.email]]
      }, {validator: emailMatcher}),
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.maxLength(25)]],
        confirmPassword: ['', [Validators.required, Validators.maxLength(25)]]
      }, {validator: passwordMatcher})
    })
  }

  confirmSignUp(): void{
    
  }

}
