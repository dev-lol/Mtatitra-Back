import { PutService } from './../../services/put.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function close() {
    document.getElementById('btn_close').click();
}


@Component({
    selector: 'app-rapport',
    templateUrl: './rapport.component.html',
    styleUrls: ['./rapport.component.css']
})
export class
    RapportComponent implements OnInit {
    faTimesCircle = faTimesCircle;

    resultat: any

    rapport: string

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private putSrv: PutService) { }

    ngOnInit() {
        this.resultat = this.data.resultat
        this.rapport = this.data.rapport
    }
}
