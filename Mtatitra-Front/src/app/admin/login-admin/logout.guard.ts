import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from './login.service';



@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {
  public auth = false;
 
  constructor(public router: Router, public loginService : LoginService) { }

  canActivate(
    
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
   
     if (this.loginService.isLoggedIn === true) {
      this.router.navigate(['/dashboard']); 
    }  
    return true
  }
}
