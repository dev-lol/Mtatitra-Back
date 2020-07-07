import { PutService } from './../../services/put.service';
import { Zone } from './../zone.component';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function close() {
    document.getElementById('btn_close').click();
}


@Component({
    selector: 'app-detail-zone',
    templateUrl: './detail-zone.component.html',
    styleUrls: ['./detail-zone.component.css']
})
export class
    DetailZoneComponent implements OnInit {
    zone: Zone = { idZon: 0, nomZon: '', lieu: [] };
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
        this.zone.idZon = this.id;
        this.zone.nomZon = this.designation;
        this.putSrv.editZone(this.id, { idZon: this.zone.idZon, nomZon: this.zone.nomZon });
        close();
    }

}
