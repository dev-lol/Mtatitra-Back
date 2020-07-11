import { PutService } from './../../services/put.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Resultat } from '../etapes.component';

function close() {
    document.getElementById('btn_close').click();
}


@Component({
    selector: 'app-detail-resultat',
    templateUrl: './detail-resultat.component.html',
    styleUrls: ['./detail-resultat.component.css']
})
export class
    DetailResultatComponent implements OnInit {
    resultat: Resultat = { idRes: 0, resultatRes: '' };
    faTimesCircle = faTimesCircle;
    id: number;
    designation: string;
    details: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private putSrv: PutService) { }

    ngOnInit() {
        this.id = this.data.id;
        this.designation = this.data.designation;
        this.details = this.data.details
    }

    modifier() {
        this.resultat.idRes = this.id;
        this.resultat.resultatRes = this.designation;
        this.putSrv.editResultat(this.id, { idRes: this.resultat.idRes, resultatRes: this.resultat.resultatRes });
        close();
    }

}
