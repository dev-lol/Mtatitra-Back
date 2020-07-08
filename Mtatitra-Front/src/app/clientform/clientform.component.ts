import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatStepper } from '@angular/material';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { ClientformService } from './clientform.service';
import { TarifService } from '../tarif/tarif.service';

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


    @ViewChild('produitsFormDirective', { static: false }) produitsFormDirective: FormGroupDirective;
    @ViewChild('detailsFormDirective', { static: false }) detailsFormDirective: FormGroupDirective;

    selectedTypeCouriser
    selectedLieuDepart
    selectedLieuDestination
    limite: Limite[] = [];
    endpoint: string = environment.API_ENDPOINT
    isLinear = true;
    detailsForm: FormGroup;
    produitForm: FormGroup;
    produits: FormArray;
    typecoursier: Array<object> = [];
    typeproduit: Array<object> = [];
    lieux: Array<object> = [];
    submitted = false;

    today = new Date()


    constructor(
        private tarifService: TarifService,
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
        forkJoin(
            [
                this.http.get<any>(`${this.endpoint}/typecoursier`),
                this.http.get<any>(`${this.endpoint}/typeproduit`),
                this.http.get<any>(`${this.endpoint}/lieu`),
                this.http.get<any>(`${this.endpoint}/datelimite`),
            ]
        ).subscribe((resultats: any) => {
            this.typecoursier = resultats[0]
            this.typeproduit = resultats[1]
            this.lieux = resultats[2]
            this.limite = resultats[3]
            console.log(this.limite)
            this.spinner.hide('liv')
        })
        this.detailsForm = this.formBuilder.group({
            typeCoursier: ['', Validators.required],
            numRecepLiv: ['', Validators.compose([
                Validators.required,
                Validators.pattern(/^3[2-49]\d{7}$/)
            ])],
            dateLiv: ['', Validators.required],
            descriptionLiv: ['', Validators.required],
            sommeRecepLiv: ['', Validators.required],
            idLieArrivee: ['', Validators.required],
            idLieDepart: ['', Validators.required],
            tarif: [''],
            idLimiteDat: ['', Validators.required],
        }, {
            validators: (formGroup: FormGroup) => {
                if (formGroup.get('idLieArrivee').errors || formGroup.get('idLieDepart').errors) {
                    return
                }
                if (formGroup.get('idLieArrivee').value === formGroup.get('idLieDepart').value) {
                    return formGroup.get('idLieArrivee').setErrors({ lieu: true })
                } else {
                    return formGroup.setErrors(null)
                }
            }
        })
        this.produitForm = this.formBuilder.group({
            produits: this.formBuilder.array([this.createItem()])
        });
    }

    get formData() { return <FormArray>this.produitForm.get('produits'); }

    // FormControleName
    createItem(): FormGroup {
        return this.formBuilder.group({
            fragilePro: [false, Validators.required],
            longueurPro: ['', Validators.required],
            largeurPro: ['', Validators.required],
            hauteurPro: ['', Validators.required],
            poidsPro: ['', Validators.required],
            consignePro: ['', Validators.required],
            prixPro: ['', Validators.required],
            typePro: ['', Validators.required],
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

    submitAll(event: Event, stepper: MatStepper) {
        return this.http.post<any>(`${this.endpoint}/livraison`, { ...this.produitForm.value, livraison: this.detailsForm.value })
            .subscribe((res: any) => {
                this.produitsFormDirective.resetForm()
                this.detailsFormDirective.resetForm()
                this.detailsForm.reset()
                this.produitForm.reset()
                stepper.reset()
            }, (error) => {
                if (error.error.errors) {
                    for (const err of error.error.errors) {
                        if (err["param"].includes("produits")) {
                            let index = err["param"].match(/\[\d+\]/)[0]
                            index = index.substring(1, index.length - 1)
                            this.formData.at(index as number).get(err["param"].split("].")[1]).setErrors({ serverError: err["msg"] })
                        } else {
                            console.log(err)
                            this.detailsForm.get(err["param"]).setErrors({ serverError: err["msg"] })
                        }
                    }
                }
                if (this.detailsForm.invalid) {
                    return stepper.selectedIndex = 0
                }
                if (this.produitForm.invalid) {
                    return stepper.selectedIndex = 1
                }
            })
    }

    handleChange(event) {
        if (this.selectedTypeCouriser && this.selectedLieuDepart && this.selectedLieuDestination) {
            this.tarifService.getTarif(this.selectedLieuDepart, this.selectedLieuDestination, this.selectedTypeCouriser).subscribe((res: any) => {
                if (res)
                    this.detailsForm.controls['tarif'].setValue(res['tarifTar'])
            })
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.detailsForm.controls; }

    // convenience getter for easy access to form fields
    get g() { return this.produitForm.controls; }


    onSubmit() {
        this.submitted = true;
        if (this.detailsForm.invalid) {
            return;
        }
    }

    onNext() {
        this.submitted = true;
        if (this.produitForm.invalid) {
            return;
        }
    }
}
