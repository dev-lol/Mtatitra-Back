import { PutService } from '../../services/put.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Lieu } from '../zone.component';

function close() {
    document.getElementById('btn_close').click();
}


@Component({
    selector: 'app-detail-lieu',
    templateUrl: './detail-lieu.component.html',
    styleUrls: ['./detail-lieu.component.css']
})
export class
    DetailLieuComponent implements OnInit {
    lieu: Lieu = { idLie: 0, nomLie: '' };
    faTimesCircle = faTimesCircle;
    id: number;
    designation: string;
    zone: number;

    zones = []

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private putSrv: PutService) { }

    ngOnInit() {
        this.id = this.data.id;
        this.designation = this.data.designation;
        this.zone = this.data.zone.idZon
        this.zones = this.data.zones
    }

    modifier() {
        this.lieu.idLie = this.id;
        this.lieu.nomLie = this.designation;
        this.putSrv.editLieu(this.id, { idLie: this.lieu.idLie, nomLie: this.lieu.nomLie, idZonZone: this.zone });
        close();
    }

}
