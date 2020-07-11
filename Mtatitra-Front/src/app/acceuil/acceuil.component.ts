import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { NgwWowService } from 'ngx-wow';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-acceuil',
    templateUrl: './acceuil.component.html',
    styleUrls: ['./acceuil.component.css']
})
export class AcceuilComponent implements OnInit {

    constructor(private router: Router, private wowService: NgwWowService) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(event => {
            // Reload WoW animations when done navigating to page,
            // but you are free to call it whenever/wherever you like
            this.wowService.init({ animateClass: "animate__animated" });
        });
    }


    ngOnInit() {
        $(".hover").mouseleave(
            function () {
                $(this).removeClass("hover");
            }
        );


    }

}
