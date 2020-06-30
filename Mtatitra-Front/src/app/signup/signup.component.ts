import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PasswordValidation } from './password-validator';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  //validation mail mail
  email = new FormControl('', [Validators.required, Validators.email]);

  // hidden password
  hide = true;
  
  form:FormGroup;
  signupForm: FormGroup;
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Vous devrez entrer une valeur';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  constructor( 
    public fb: FormBuilder,
    public loginService: LoginService,
    public router: Router
    ) {
      
     }

  ngOnInit() {
    AOS.init();

    this.signupForm = this.fb.group({
      nom: [''],
      prenom: [''],
      telephone: [''],
      adresse: [''],
      email: ['']
    });

    //confirmation mot de passe 
    this.form = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  registerUser() {
    let signupValue = {...this.form.value, ...this.signupForm.value}

    signupValue["nomCli"] = signupValue["nom"]
    delete(signupValue["nom"])
    signupValue["prenomCli"] = signupValue["prenom"]
    delete(signupValue["prenom"])
    signupValue["adresseCli"] = signupValue["adresse"]
    delete(signupValue["adresse"])
    signupValue["passCli"] = signupValue["password"]
    delete(signupValue["password"])
    signupValue["emailCli"] = Object.values(this.email.value).join("")
    delete(signupValue["email"])
    signupValue["numTelCli"] = signupValue["telephone"]
    delete(signupValue["telephone"])
    console.log(signupValue)

    this.loginService.signUp(signupValue).subscribe((res) => {
        this.signupForm.reset()
        this.router.navigate([`mailconfirmation/${signupValue["emailCli"]}`]);
    },(error) => {
        this.router.navigate(["404"])
    })
  }

}
