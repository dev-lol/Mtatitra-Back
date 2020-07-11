import { PutService } from './../../services/put.service';
import { Coursier } from './../coursier.component';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { faTimesCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

function close() {
    document.getElementById('btn_close').click();
}

@Component({
    selector: 'app-detail-coursier',
    templateUrl: './detail-coursier.component.html',
    styleUrls: ['./detail-coursier.component.css']
})
export class DetailCoursierComponent implements OnInit {
    form: FormGroup
    
    changePassword: boolean = false;
    
    faTimesCircle = faTimesCircle;
    faClose = faTimes
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public putSrv: PutService, private fb: FormBuilder) { }
    
    id: number;
    ngOnInit() {
        this.id = this.data.id
        this.form = this.fb.group({
            nomCou: [this.data.nom, Validators.required],
            prenomCou: [this.data.prenom, Validators.required],
            numTelCou: [this.data.tel, Validators.required],
            usernameCou: [this.data.username, Validators.required],
            idTypeCouTypeCoursier: [this.data.type, Validators.required],
            referenceVehiculeCou: [this.data.ref, Validators.required],
            numTelUrgentCou: [this.data.telUrg, Validators.required],
            adresseCou: [this.data.adresse, Validators.required],
            passCou: ['']
        })
    }
    modifier() {
        let coursier = this.form.value;
        if(!this.changePassword)
            delete coursier["passCou"]
        this.putSrv.editCoursier(this.data.id, coursier);
        close();
    }

    passChange(data: boolean) {
        this.changePassword = data
    }
}
