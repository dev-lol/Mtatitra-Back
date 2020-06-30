import { Router } from '@angular/router';
import { DisplayService } from './../services/display.service';
import { Component, OnInit } from '@angular/core';
import { faHome, faUser, faCarAlt, faCartArrowDown, faStream, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../login-admin/login.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    logo = '../../../assets/images/rounded.png';

    faHome = faHome;
    faUser = faUser;
    faCarAlt = faCarAlt;
    faCartArrowDown = faCartArrowDown;
    faStream = faStream;
    faGlobe = faGlobe;

    constructor(public displaySrv: DisplayService, private login: LoginService, private router: Router) { }

    ngOnInit() {
    }

    slideDashboard() {
        this.displaySrv.show = 'dashboard';
        this.router.navigate(['/admin/dashboard']);
    }

    slideClient() {
        this.displaySrv.show = 'client';
        this.router.navigate(['/admin/client']);
    }

    slideCoursier() {
        this.displaySrv.show = 'coursier';
        this.router.navigate(['/admin/coursier']);
    }

    slideProduit() {
        this.displaySrv.show = 'produit';
        this.router.navigate(['/admin/produit']);
    }

    slideLivraison() {
        this.displaySrv.show = 'livraison';
        this.router.navigate(['/admin/livraison']);
    }

    slideZone() {
        this.displaySrv.show = 'zone';
        this.router.navigate(['/admin/zone']);
    }

    logOut() {
        this.login.logout()
    }

}
