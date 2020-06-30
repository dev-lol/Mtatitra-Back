import { DisplayService } from './../services/display.service';
import { Component, OnInit } from '@angular/core';
import { faStar, faChartBar, faUserGraduate, faUniversity, faBlog, faCube, faBars, faCreditCard,
  faArrowAltCircleRight, faHome, faUser, faCarAlt, faCartArrowDown, faStream, faGlobe,
  faStreetView } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  livraison = '../../../assets/images/livraison.jpg';

  faStar = faStar;
  faChartBar = faChartBar;
  faUserGraduate = faUserGraduate;
  faUniversity = faUniversity;
  faBlog = faBlog;
  faCube = faCube;
  faBars = faBars;
  faCreditCard = faCreditCard;
  faArrowAltCircleRight = faArrowAltCircleRight;
  faHome = faHome;
  faUser = faUser;
  faCarAlt = faCarAlt;
  faCartArrowDown = faCartArrowDown;
  faStream = faStream;
  faGlobe = faGlobe;
  faStreetView = faStreetView;


  show = '';

  constructor(public router: Router, public display: DisplayService) { }

  ngOnInit() {
  }

  slideDashboard() {
    this.display.show = 'dashboard';
    this.router.navigate(['/admin/dashboard']);
  }

  slideClient() {
    this.display.show = 'client';
    this.router.navigate(['/admin/client']);
  }

  slideCoursier() {
    this.display.show = 'coursier';
    this.router.navigate(['/admin/coursier']);
  }

  slideProduit() {
    this.display.show = 'produit';
    this.router.navigate(['/admin/produit']);
  }

  slideLivraison() {
    this.display.show = 'livraison';
    this.router.navigate(['/admin/livraison']);
  }

  slideType() {
    this.display.show = 'type';
    this.router.navigate(['/admin/type']);
  }


  slideZone() {
    this.display.show = 'zone';
    this.router.navigate(['/admin/zone']);
  }

  slideTarif() {
    this.display.show = 'tarif';
    this.router.navigate(['/admin/tarif']);
  }

}
