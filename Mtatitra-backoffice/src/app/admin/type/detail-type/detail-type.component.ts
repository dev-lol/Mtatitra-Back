import { PutService } from './../../services/put.service';
import { TypeCoursier, TypeProduit } from './../type.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { faTimesCircle, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

function close() {
    document.getElementById('btn_close').click();
}

@Component({
    selector: 'app-detail-type',
    templateUrl: './detail-type.component.html',
    styleUrls: ['./detail-type.component.css']
})
export class DetailTypeComponent implements OnInit {

    coursier: TypeCoursier = {
        idTypeCou: 0,
        typeCou: '',
        poidsMaxTypeCou: 0
    };

    produit: TypeProduit = {
        idTypePro: 0,
        typePro: ''
    };
    type: string;
    id: number;
    designation: string;
    poidsMax: number;

    faTimesCircle = faTimesCircle;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public putSrv: PutService) { }

    ngOnInit() {
        console.log(this.data)
        this.type = this.data.type;
        this.id = this.data.id;
        this.designation = this.data.designation;
        if (this.type === 'coursier') {
            this.poidsMax = this.data.poidsMax
        }
    }


    modifier() {
        if (this.type === 'coursier') {

            this.coursier.idTypeCou = this.id;
            this.coursier.typeCou = this.designation;
            this.coursier.poidsMaxTypeCou = this.poidsMax


            this.putSrv.editTypeCoursier(this.id, this.coursier);
        } else if (this.type === 'produit') {
            this.produit.idTypePro = this.id;
            this.produit.typePro = this.designation;
            this.putSrv.editTypeProduit(this.id, this.produit);
        }
        close();
    }

}
