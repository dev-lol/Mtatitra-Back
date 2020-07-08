import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PasswordValidation } from './password-validator';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    submitted = false;


    // hidden password
    hide = true;
    signupForm: FormGroup;

    constructor(
        public fb: FormBuilder,
        public loginService: LoginService,
        public router: Router
    ) {

    }

    ngOnInit() {
        this.signupForm = this.fb.group({
            nomCli: ['', Validators.required],
            prenomCli: ['', Validators.required],
            numTelCli: ['', Validators.compose([Validators.required, Validators.pattern(/^3[2-49]\d{7}$/)])],
            adresseCli: ['', Validators.required],
            emailCli: ['', Validators.compose([Validators.required, Validators.email])],
            pageFbCli: [''],
            compteFbCli: [''],
            siteWebCli: [''],
            passCli: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        }, {
            validator: PasswordValidation.MatchPassword
        });
    }

    registerUser() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.signupForm.invalid) {
            return;
        }

        let signupValue = this.signupForm.value
        this.loginService.signUp(signupValue).subscribe((res) => {
            this.signupForm.reset()
            this.router.navigate([`mailconfirmation/${signupValue["emailCli"]}`]);
        }, (error) => {
            if (error.error.errors) {
                for (const err of error.error.errors) {
                    this.signupForm.get(err["param"]).setErrors({ serverError: err["msg"] })
                }
            }
        })
    }

    get controls() { return this.signupForm.controls }

}
