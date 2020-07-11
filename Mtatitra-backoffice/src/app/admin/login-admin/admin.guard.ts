import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from './login.service';
import { SocketService } from 'src/app/socket/socket.service';



@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    public auth = false;

    constructor(private socketService: SocketService, public router: Router, public loginService: LoginService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        if (!this.socketService.socket) {
            this.socketService.setupSocketConnection()
        }
        if (this.loginService.isLoggedIn !== true) {
            this.router.navigate(['/login']);
        }
        return true
    }
}
