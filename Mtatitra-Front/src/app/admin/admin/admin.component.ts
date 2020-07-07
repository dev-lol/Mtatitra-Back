import { DisplayService } from './../services/display.service';
import { Component, OnInit } from '@angular/core';
import { faStar, faChartBar, faUserGraduate, faUniversity, faBlog, faCube, faBars, faCreditCard,
  faArrowAltCircleRight, faHome, faUser, faCarAlt, faCartArrowDown, faStream, faGlobe,
  faStreetView, 
  faClock} from '@fortawesome/free-solid-svg-icons';
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
  faClock = faClock

  show = '';

  constructor(public router: Router, public display: DisplayService) { }

  ngOnInit() {
  }

  slideDashboard() {
    this.display.show = 'dashboard';
    this.router.navigate(['/dashboard']);
  }

  slideClient() {
    this.display.show = 'client';
    this.router.navigate(['/client']);
  }

  slideCoursier() {
    this.display.show = 'coursier';
    this.router.navigate(['/coursier']);
  }

  slideProduit() {
    this.display.show = 'produit';
    this.router.navigate(['/produit']);
  }

  slideLivraison() {
    this.display.show = 'livraison';
    this.router.navigate(['/livraison']);
  }

  slideType() {
    this.display.show = 'type';
    this.router.navigate(['/type']);
  }


  slideZone() {
    this.display.show = 'zone';
    this.router.navigate(['/zone']);
  }

  slideTarif() {
    this.display.show = 'tarif';
    this.router.navigate(['/tarif']);
  }

  slideDate(){
    this.display.show = "date",
    this.router.navigate(["/date"])
  }

 

}
