import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, 
UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {

  constructor(
    public loginService: LoginService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loginService.isLoggedIn === true) {
      this.router.navigate(['acceuil'])
    }
    return true;
  }
}