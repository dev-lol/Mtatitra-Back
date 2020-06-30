import { GetService } from './../../services/get.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { PutService } from './../../services/put.service';
import { Subscription } from 'rxjs';



function close() {
    if (document.getElementById('btn_close')) {
        document.getElementById('btn_close').click();
    }
}

interface Tarif {
    tarifTar: number;
    idZonZone: number;
    idTypeCouTypeCoursier: number;
}

@Component({
    selector: 'app-detail-tarif',
    templateUrl: './detail-tarif.component.html',
    styleUrls: ['./detail-tarif.component.css']
})
export class DetailTarifComponent implements OnInit {
    idTar: number;
    tarifTar: number;
    nomZon: string;
    typeCou: string;
    idZonZone: number = this.data.zone.idZon;
    idTypeCouTypeCoursier: number = this.data.typeCoursier.idTypeCou;

    tarif: Tarif = { tarifTar: 0, idZonZone: 0, idTypeCouTypeCoursier: 0 };

    faTimesCircle = faTimesCircle;

    coursiers = [];

    zones = [];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public putSrv: PutService, public getSrv: GetService) { }

    ngOnInit() {
        this.getData();
        this.init();
    }

    init() {

        this.zones = this.data.zones;
        this.coursiers = this.data.typeCoursiers;
    }

    getData() {
        this.idTar = this.data.id;
        this.tarifTar = this.data.tarif;
        this.nomZon = this.data.zone;
        this.typeCou = this.data.typeCou;
    }

    modifier() {
        this.tarif.tarifTar = this.tarifTar;
        this.tarif.idZonZone = this.idZonZone;
        this.tarif.idTypeCouTypeCoursier = this.idTypeCouTypeCoursier;
        console.log(this.tarif)
        this.putSrv.editTarif(this.idTar, this.tarif);
        close();
    }

}
