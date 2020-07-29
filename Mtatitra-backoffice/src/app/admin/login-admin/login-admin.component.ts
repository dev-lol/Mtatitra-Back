import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';

@Component({
    selector: 'app-login-admin',
    templateUrl: './login-admin.component.html',
    styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {
    reinit = false;

    signIn: FormGroup;
    signUp: FormGroup;
    constructor(
        public loginService: LoginService,
        public route: Router,
        public formBuilder: FormBuilder) { }

    ngOnInit() {
        this.initSignIn();
        this.initSignUp();
    }

    initSignIn() {
        this.signIn = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    initSignUp() {
        this.signUp = this.formBuilder.group({
            oldPass: ['', Validators.required],
            newPass: ['', Validators.required],
            confPass: ['', Validators.required],
        });

        
    }

    signInAdmin(event) {
        event.preventDefault()
        this.loginService.signIn(this.signIn.value)
    }

    newAdmin() {

        this.loginService.reset(this.signUp.value)
        //this.route.navigate(['/dashboard']);
    }

    toggleReinit() {
        this.reinit = !this.reinit;
    }

}
