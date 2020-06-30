import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, RouterStateSnapshot,
    UrlTree, CanActivate, Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { SocketService } from '../socket/socket.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        public socketService: SocketService,
        public loginService: LoginService,
        public router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.socketService.socket) {
            this.socketService.setupSocketConnection()
        }
        if (this.loginService.isLoggedIn !== true) {
            this.router.navigate(['login'])
        }
        return true;
    }
}