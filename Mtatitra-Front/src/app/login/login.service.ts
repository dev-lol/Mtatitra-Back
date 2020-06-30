import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    endpoint: string = environment.API_ENDPOINT;
    currentUser = {};
    private email:string = ""

    error:Subject<String> = new Subject()

    constructor(
        private http: HttpClient,
        public router: Router
    ) { }

    private parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    // Sign-up
    signUp(user: User): Observable<any> {
        let api = `${this.endpoint}/signup`;
        return this.http.post(api, user)
            .pipe(
                catchError(this.handleError)
            )
    }

    // Sign-in
    signIn(user: User) {
        this.email = user.username.toString()
        return this.http.post<any>(`${this.endpoint}/login`, user)
            .subscribe((res: any) => {
                localStorage.setItem('access_token', res.token)
                this.router.navigate(['profile']);
            }, (error) => {
                this.handleLoginError(error)
            })
    }


    
    
    getToken() {
        return localStorage.getItem('access_token');
    }


    get isLoggedIn(): boolean {
        let authToken = localStorage.getItem('access_token');
        return (authToken !== null) ? true : false;
    }



    doLogout() {
        let removeToken = localStorage.removeItem('access_token');
        if (removeToken == null) {
            this.router.navigate(['acceuil']);
        }
    }

    // Error 
    handleError(error: HttpErrorResponse) {
        let msg = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            msg = error.error.message;
        } else {
            // server-side error
            msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(msg);
    }
    handleLoginError(error: HttpErrorResponse) {
        console.log(error)
        let message = error.error.message;
        if (message.includes("non confirmee")) {
            this.router.navigate([`mailconfirmation/${this.email}`])
        }
        if (message.includes("Invalid credentials")) {
            this.error.next("Invalid credentials");
        }
    }
}
