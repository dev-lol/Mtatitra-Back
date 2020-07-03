import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import * as AOS from 'aos';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { ClientformService } from './clientform.service';

interface Limite {
    idLimiteDat: number;
    limiteDat: string;
}

@Component({
    selector: 'app-clientform',
    templateUrl: './clientform.component.html',
    styleUrls: ['./clientform.component.css']
})
export class ClientformComponent implements OnInit {


    selectedTypeCouriser

    selectedZone

    limite: Limite[] = [];

    endpoint: string = environment.API_ENDPOINT
    isLinear = false;
    detailsForm: FormGroup;
    produitForm: FormGroup;
    produits: FormArray;

    typecoursier: Array<object> = [];
    typeproduit: Array<object> = [];
    zone: Array<object> = [];


    constructor(
        private clientformService: ClientformService,
        private spinner: NgxSpinnerService,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        public datePipe: DatePipe,
        private router: Router
    ) { }

    ngOnInit() {
        this.spinner.show('liv')
        AOS.init();
        forkJoin(
            [
                this.http.get<any>(`${this.endpoint}/typecoursier`),
                this.http.get<any>(`${this.endpoint}/typeproduit`),
                this.http.get<any>(`${this.endpoint}/zone`),
                this.http.get<any>(`${this.endpoint}/datelimite`),
            ]
        ).subscribe((resultats: any) => {
            this.typecoursier = resultats[0]
            this.typeproduit = resultats[1]
            this.zone = resultats[2]
            this.limite = resultats[3]
            console.log(this.limite)
            this.spinner.hide('liv')
        })
        this.detailsForm = this.formBuilder.group({
            typeCoursier: '',
            numRecepLiv: '',
            dateLiv: '',
            descriptionLiv: '',
            sommeRecepLiv: '',
            destinationLiv: '',
            departLiv: '',
            zoneLiv: '',
            tarif: '',
            idLimiteDat: '',
        })
        this.produitForm = this.formBuilder.group({
            produits: this.formBuilder.array([this.createItem()])
        });
    }

    get formData() { return <FormArray>this.produitForm.get('produits'); }

    // FormControleName
    createItem(): FormGroup {
        return this.formBuilder.group({
            fragilePro: '',
            longueurPro: '',
            largeurPro: '',
            hauteurPro: '',
            poidsPro: '',
            consignePro: '',
            prixPro: '',
            typePro: '',
        });
    }

    // Ajout de produit
    addItem(): void {
        this.produits = this.produitForm.get('produits') as FormArray;
        this.produits.push(this.createItem());
    }


    // Supression de produit
    deleteItemLine(e, i): void {
        e.preventDefault();
        this.produits = this.produitForm.get('produits') as FormArray;
        this.produits.removeAt(i);
    }

    submitAll(event: Event, stepper) {
        return this.http.post<any>(`${this.endpoint}/livraison`, { ...this.produitForm.value, livraison: this.detailsForm.value })
            .subscribe((res: any) => {
                stepper.reset()
            }, (error) => {
                console.log(error)
            })
    }

    handleChange(event) {
        if (this.selectedTypeCouriser && this.selectedZone) {
            this.clientformService.getTarif(this.selectedTypeCouriser, this.selectedZone).subscribe((res: any) => {
                this.detailsForm.controls['tarif'].setValue(res['tarifTar'])
            })
        }
    }
}
