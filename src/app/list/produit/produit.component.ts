import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-produit',
    templateUrl: './produit.component.html',
    styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {

    produits = this.data.produits
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
    ngOnInit() {
    }

}
