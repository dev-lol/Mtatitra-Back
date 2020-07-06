import { Component, OnInit } from '@angular/core';
import { TarifService, Tarif, Lieu } from './tarif.service';
import { MatSelectChange } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-tarif',
    templateUrl: './tarif.component.html',
    styleUrls: ['./tarif.component.css']
})
export class TarifComponent implements OnInit {

    tarifs: Tarif[] = []
    lieux: Array<object> = [];

    selectedLieuDepart: Lieu
    selectedLieuDestination: Lieu

    endpoint = environment.API_ENDPOINT
    typecoursier: Array<object> = [];
    constructor(
        private http: HttpClient,
        private spinner: NgxSpinnerService,
        private tarifService: TarifService
    ) { }

    ngOnInit() {
        this.spinner.show('tarif')
        forkJoin(
            [
                this.http.get<any>(`${this.endpoint}/typecoursier`),
                this.http.get<any>(`${this.endpoint}/lieu`),
            ]
        ).subscribe((resultats: any) => {
            this.typecoursier = resultats[0]
            this.lieux = resultats[1]
            this.spinner.hide('tarif')
        })
    }

    handleChange(event) {
        this.tarifs = [];
        if (this.selectedLieuDepart && this.selectedLieuDestination) {
            if (this.selectedLieuDepart.idLie == this.selectedLieuDestination.idLie)
                return
            this.spinner.show("tarif")
            this.tarifService.getTarif(this.selectedLieuDepart.idLie, this.selectedLieuDestination.idLie).subscribe((res: any) => {
                if (res)
                    this.tarifs = res
                this.spinner.hide("tarif")
            })
        }
    }
}
