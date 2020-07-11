import { Component, OnInit, Inject } from '@angular/core';
import { ListService } from '../list.service';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
    selector: 'app-rapport',
    templateUrl: './rapport.component.html',
    styleUrls: ['./rapport.component.css']
})
export class RapportComponent implements OnInit {
    resultat: string = ''
    rapport: string = ''
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.resultat = this.data.livraison.idResResultat ? this.data.livraison.idResResultat.resultatRes : "Inconnu"
        this.rapport = this.data.livraison.rapportLiv
    }

}
