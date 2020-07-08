import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MailconfirmationService {

    constructor(private http: HttpClient,
        public router: Router) { }
    endpoint: String = environment.API_ENDPOINT
    resendCode(email){
        let api = `${this.endpoint}/resend`;
        this.http.post(api, {emailCli: email}).subscribe((res:any) => {
            localStorage.removeItem("emailCli")
        })
    }
    checkConfirmation(email,code){
        let api = `${this.endpoint}/confirmation`;
        return this.http.post(api, {email: email, code:code})
    }
}
