import { GetService } from './../../services/get.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { PutService } from './../../services/put.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



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
    formTarif: FormGroup
    idTar: number;
    faTimesCircle = faTimesCircle;

    coursiers = [];

    zones = [];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public putSrv: PutService, public getSrv: GetService, private fb: FormBuilder) { }

    ngOnInit() {
        console.log(this.data)
        this.idTar = this.data.id;
        this.init();
        this.formTarif = this.fb.group({
            tarifTar: [this.data.tar, Validators.required],
            idZonDepart: [this.data.zoneA.idZon, Validators.required], 
            idZonArrivee: [this.data.zoneB.idZon, Validators.required],
            idTypeCouTypeCoursier: [this.data.typeCoursier.idTypeCou, Validators.required]
        })
    }

    init() {
        this.zones = this.data.zones;
        this.coursiers = this.data.typeCoursiers;
    }

    modifier() {
        this.putSrv.editTarif(this.idTar, this.formTarif.value);
        close();
    }

}
