import { Component, OnInit } from '@angular/core';
import { TarifService, Tarif, Lieu } from './tarif.service';
import { MatSelectChange } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

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

    searchForm: FormGroup

    endpoint = environment.API_ENDPOINT
    constructor(
        private http: HttpClient,
        private spinner: NgxSpinnerService,
        private tarifService: TarifService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.spinner.show('tarif')
        forkJoin(
            [
                this.http.get<any>(`${this.endpoint}/lieu`),
            ]
        ).subscribe((resultats: any) => {
            this.lieux = resultats[0]
            this.spinner.hide('tarif')
        })
        this.searchForm = this.fb.group({
            lieuA: [''],
            lieuB: ['']
        }, {
            validators: (formGroup: FormGroup) => {
                if (formGroup.controls.lieuA.value && formGroup.controls.lieuB.value && formGroup.controls.lieuA.value == formGroup.controls.lieuB.value) {
                    formGroup.controls.lieuA.setErrors({ lieu: true })
                    formGroup.controls.lieuB.setErrors({ lieu: true })
                } else {
                    formGroup.controls.lieuA.setErrors(null)
                    formGroup.controls.lieuB.setErrors(null)
                }
            }
        })
    }

    handleChange(event) {

       this.searchForm.updateValueAndValidity()
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
