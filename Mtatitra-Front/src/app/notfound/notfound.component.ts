import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow';

@Component({
    selector: 'app-notfound',
    templateUrl: './notfound.component.html',
    styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {

    constructor(private wowService: NgwWowService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {

        this.wowService.init({ animateClass: "animate__animated" })
    }

}
