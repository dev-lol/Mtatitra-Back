import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import * as AOS from 'aos';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    // hidden password
    hide = true;

    errorMessage: string
    signinForm: FormGroup;
    constructor(
        public fb: FormBuilder,
        public loginService: LoginService,
        public router: Router
    ) { }

    ngOnInit() {
        AOS.init();

        this.signinForm = this.fb.group({
            username: ['client_test@client.com'],
            password: ['1234']
        })
    }

   

    loginUser() {
        this.loginService.signIn(this.signinForm.value)
        this.loginService.error.subscribe((error) => {
            switch (error) {
                case "Invalid credentials":
                    this.errorMessage = "Nom d'utilisateur ou mot de passe incorrect"
                    break;
                case null:
                case "":
                    this.errorMessage = ""
                    break
                default:
                    this.errorMessage = "Erreur inconnue"
                    break;
            }
        })
    }
}


