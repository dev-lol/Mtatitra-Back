import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { LoginService } from './login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, catchError } from "rxjs/operators"
import { throwError } from 'rxjs';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {

    shouldShow = true;
    constructor(private router: Router, private loginService: LoginService, private spinner: NgxSpinnerService) {
        this.router.events.subscribe(val => {
            if (val instanceof NavigationStart) {
                this.shouldShow = true
            }
        });
    }
    count = 0;
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.loginService.isLoggedIn || req.url.includes("login"))
            return next.handle(req)
        if (req.method == 'GET' && this.shouldShow)
            this.spinner.show()
        this.count++;
        const authToken = this.loginService.getToken();
        req = req.clone({
            setHeaders: {
                Authorization: "Bearer " + authToken
            }
        });
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            if (error && error.status === 401) {
                this.loginService.logout()
            } else {
                return throwError(error);
            }
        }), finalize(() => {
            this.count--;
            if (this.count == 0) { this.spinner.hide(); this.shouldShow = false }
        }));
    }

}