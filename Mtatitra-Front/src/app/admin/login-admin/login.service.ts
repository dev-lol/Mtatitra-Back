import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';




@Injectable({
    providedIn: 'root'
})
export class LoginService {
    endpoint = environment.API_ENDPOINT

    constructor(
        private http: HttpClient,
        public router: Router
    ) { }

    signIn(admin: any) {

        return this.http.post<any>(`${this.endpoint}/login`, admin)
            .subscribe((res: any) => {
                localStorage.setItem('token', res.token)
                this.router.navigate(['/dashboard']);
            }, (error) => {
                //this.handleLoginError(error)
            })
    }

    getToken() {
        return localStorage.getItem('token');
    }
    get isLoggedIn(): boolean {
        let authToken = localStorage.getItem('token');
        return (authToken !== null) ? true : false;
    }

    logout() {
        let removeToken = localStorage.removeItem('token');
        if (removeToken == null) {
            this.router.navigate(['login']);
        }
    }

}
