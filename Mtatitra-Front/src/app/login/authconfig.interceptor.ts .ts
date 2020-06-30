import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { LoginService } from './login.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {

    constructor(private loginService: LoginService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.loginService.isLoggedIn || req.url.includes("login"))
            return next.handle(req)
        const authToken = this.loginService.getToken();
        req = req.clone({
            setHeaders: {
                Authorization: "Bearer " + authToken
            }
        });
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            if (error && error.status === 401) {
                this.loginService.doLogout()
            } else {
                return throwError(error);
            }
        }))
    }

}