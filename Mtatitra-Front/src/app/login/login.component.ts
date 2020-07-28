import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

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
        this.signinForm = this.fb.group({
            username: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.required]
        })
    }



    loginUser() {
        if (this.signinForm.invalid)
            return;
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


