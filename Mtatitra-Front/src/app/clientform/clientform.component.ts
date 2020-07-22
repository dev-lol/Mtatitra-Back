import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, NgForm, FormGroupDirective, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatStepper } from '@angular/material';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router, ParamMap } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, ReplaySubject } from 'rxjs';
import { ClientformService } from './clientform.service';
import { TarifService, Lieu } from '../tarif/tarif.service';

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
    limite: Limite[] = [];
    endpoint: string = environment.API_ENDPOINT
    isLinear = true;
    detailsForm: FormGroup;
    produitForm: FormGroup;
    produits: FormArray;
    typecoursier: Array<object> = [];
    typeproduit: Array<object> = [];
    lieux: Lieu[] = [];
    submitted = false;

    idLieDepartFilter = new FormControl('')
    idLieArriveeFilter = new FormControl('')
    public filteredLieuDepart: ReplaySubject<Lieu[]> = new ReplaySubject<Lieu[]>(1);
    public filteredLieuArrivee: ReplaySubject<Lieu[]> = new ReplaySubject<Lieu[]>(1);

    today = new Date()
    maintenant: number = Date.now();


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
                if (formGroup.get('idLieArrivee').value.idLie === formGroup.get('idLieDepart').value.idLie) {
                    return formGroup.get('idLieArrivee').setErrors({ lieu: true })
                } else {
                    if (formGroup.get('idLieArrivee').hasError('lieu')) {
                        const { lieu, ...errors } = formGroup.get('idLieArrivee').errors
                        if (Object.keys(errors).length != 0) {
                            formGroup.get('idLieArrivee').setErrors(errors)
                        } else {
                            formGroup.get('idLieArrivee').setErrors(null)
                        }
                    }
                }
            }
        })
        this.produitForm = this.formBuilder.group({
            produits: this.formBuilder.array([this.createItem()])
        }, {
            validators: (formGroup: FormGroup) => {
                const produits: FormArray = formGroup.controls.produits as FormArray
                let total = 0
                for (let i = 0; i < produits.length; i++) {
                    total += Number(produits.at(i).get('poidsPro').value)
                }
                if (this.detailsForm.get('typeCoursier').value && total > this.detailsForm.get('typeCoursier').value.poidsMaxTypeCou) {
                    for (let i = 0; i < produits.length; i++) {
                        produits.at(i).get('poidsPro').setErrors({ poids: true });
                        produits.at(i).get('poidsPro').markAsTouched()
                    }
                } else {
                    for (let i = 0; i < produits.length; i++) {
                        if ((produits.at(i) as FormGroup).controls.poidsPro.hasError('poids')) {
                            const { poids, ...errors } = produits.at(i).get('poidsPro').errors
                            if (Object.keys(errors).length != 0) {
                                produits.at(i).get('poidsPro').setErrors(errors)
                            } else {
                                produits.at(i).get('poidsPro').setErrors(null)
                            }
                        }
                    }
                }
            }
        });

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

            this.filteredLieuDepart.next([...this.lieux]);
            this.filteredLieuArrivee.next([...this.lieux]);

            setTimeout(() => {
                let params: ParamMap = this.router.parseUrl(this.router.url).queryParamMap
                if (params.has("lieuA")) {
                    this.detailsForm.controls.idLieDepart.setValue(this.lieux.find((v) => v['idLie'] == Number(params.get("lieuA"))))
                }
                if (params.has("lieuB")) {
                    this.detailsForm.controls.idLieArrivee.setValue(this.lieux.find((v) => v['idLie'] == Number(params.get("lieuB"))))
                }
                if (params.has("typeCoursier")) {
                    this.detailsForm.controls.typeCoursier.setValue(this.typecoursier.find((v) => v['idTypeCou'] == Number(params.get("typeCoursier"))))
                }
                this.handleChange(null)
            }, 200)
            this.detailsForm.updateValueAndValidity()
            this.spinner.hide('liv')
        })

        this.idLieDepartFilter.valueChanges
            .subscribe(() => {
                this.filterIdLieuDepart();
            });
        this.idLieArriveeFilter.valueChanges
            .subscribe(() => {
                this.filterIdLieuArrivee();
            });
    }

    filterIdLieuDepart() {
        const l = [...this.lieux]
        this.filteredLieuDepart.next(l.filter((v) => v.nomLie.toLowerCase().includes(this.idLieDepartFilter.value.toLowerCase())))
    }

    filterIdLieuArrivee() {
        const l = [...this.lieux]
        this.filteredLieuArrivee.next(l.filter((v) => v.nomLie.toLowerCase().includes(this.idLieArriveeFilter.value.toLowerCase())))
    }

    get formData() { return <FormArray>this.produitForm.get('produits'); }

    // FormControleName
    createItem(): FormGroup {
        return this.formBuilder.group({
            fragilePro: [null],
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
        const fg = this.createItem()
        this.produits.push(fg);
        this.produitForm.markAsUntouched()
    }


    // Supression de produit
    deleteItemLine(e, i): void {
        e.preventDefault();
        this.produits = this.produitForm.get('produits') as FormArray;
        this.produits.removeAt(i);
    }

    submitAll(event: Event, stepper: MatStepper) {
        const produits = this.produitForm.value.produits
        for (const pro of produits) {
            pro.fragilePro = pro.fragilePro ? true : false
        }
        const data = {
            produits: produits,
            livraison: {
                ...this.detailsForm.value,
                idLieDepart: this.detailsForm.get('idLieDepart').value.idLie,
                idLieArrivee: this.detailsForm.get('idLieArrivee').value.idLie,
                typeCoursier: this.detailsForm.get('typeCoursier').value.idTypeCou,
                idLimiteDat: this.detailsForm.get('idLimiteDat').value.idLimiteDat
            },
        }
        return this.http.post<any>(`${this.endpoint}/livraison`, data)
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
                            if (err["param"].includes("livraison")) {
                                console.log(err)
                                this.detailsForm.get(err["param"].split(".")[0]).setErrors({ serverError: err["msg"] })
                            }
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

    handleTypeCoursierChange(event) {
        this.handleChange(event)
    }

    handleChange(event) {
        this.detailsForm.get('tarif').setValue('')
        const typeCoursier = this.detailsForm.controls.typeCoursier.value
        const arr = this.detailsForm.controls.idLieArrivee.value
        const dep = this.detailsForm.controls.idLieDepart.value
        if (typeCoursier && arr && dep && dep.idLie != arr.idLie) {
            this.tarifService.getTarif(dep.idLie, arr.idLie, typeCoursier.idTypeCou).subscribe((res: any) => {
                if (res)
                    this.detailsForm.controls['tarif'].setValue(res['tarifTar'])
            })
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.detailsForm.controls; }

    // convenience getter for easy access to form fields
    get g() { return this.produitForm.controls; }

    getTypeProduit(id: number) {
        return this.typeproduit.find(v => v["idTypePro"] == id)
    }

    onSubmit() {
        this.submitted = true;
        this.detailsForm.markAllAsTouched()
        if (this.detailsForm.invalid) {
            return;
        }
    }
    onNext() {
        this.submitted = true;
        this.produitForm.markAllAsTouched()
        if (this.produitForm.invalid) {
            return;
        }

    }

    getTotal(marks) {
        return marks.reduce((acc, {prixPro}) => acc += +(prixPro || 0), 0);
      }
}
