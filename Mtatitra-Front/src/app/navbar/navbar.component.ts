import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../login/login.service';
import * as AOS from 'aos';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    @Input() estAcceuil = false
    constructor(
      public loginService:LoginService
  ) { }

  ngOnInit() {
    AOS.init();
  }

}
