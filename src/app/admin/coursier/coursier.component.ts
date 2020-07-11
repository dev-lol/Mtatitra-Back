
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { DetailCoursierComponent } from './detail-coursier/detail-coursier.component';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { DeleteService } from './../services/delete.service';
import { GetService } from './../services/get.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { faEyeSlash, faMailBulk, faUser, faUserAlt, faUserAltSlash, faPhone, faEyeDropper, faCarAlt, faCar, faMapPin } from '@fortawesome/free-solid-svg-icons';
import { PostService } from './../../admin/services/post.service';
import { faPlusCircle, faEdit, faMinusCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TypeCoursier } from '../type/type.component';
import { catchError } from 'rxjs/operators';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { FormatterService } from '../services/formatter.service';

// changer
function open() {
    document.getElementById('btn_open').click();
}

function close() {
    document.getElementById('close').click();
}

export interface Coursier {
    idCou: number;
    nomCou: string;
    prenomCou: string;
    numTelCou: string;
    numTelUrgentCou: string;
    adresseCou: string;
    referenceVehiculeCou: string;
    usernameCou: string;
    passCou: string;
}

@Component({
    selector: 'app-coursier',
    templateUrl: './coursier.component.html',
    styleUrls: ['./coursier.component.css']
})
export class CoursierComponent implements OnInit {
    @ViewChild(MatPaginator, { static: false }) coursierPaginator: MatPaginator;
    img = '../../../assets/images/cours.png';
    coursiers: Coursier[] = [];

    typeCoursier: TypeCoursier[] = [];
    coursierDatasource = new MatTableDataSource(this.coursiers);
    columnCoursiers: string[] = ['idCou', 'nomCou', 'prenomCou', 'numTelCou', 'numTelUrgentCou', 'adresseCou', "referenceVehiculeCou", 'usernameCou', 'typeCoursier', 'edit', 'suppr'];
    coursierSub: Subscription;

    selectedType = 'init';
    passConfirm = '';
    coursierAdded = {
        nomCou: '',
        prenomCou: '',
        numTelCou: '',
        numTelUrgentCou: '',
        adresseCou: "",
        referenceVehiculeCou: "",
        usernameCou: '',
        passCou: ''
    };

    faEyeSlash = faEyeSlash;
    faMailBulk = faMailBulk;
    faUser = faUser;
    faUserAlt = faUserAlt;
    faCar = faCarAlt;
    faPhone = faPhone;
    faEyeDropper = faEyeDropper;
    faUserAltSlash = faUserAltSlash;
    faPlusCircle = faPlusCircle;
    faEdit = faEdit;
    faMinusCircle = faMinusCircle;
    faSearch = faSearch;
    faPin = faMapPin

    coursierForm: FormGroup;

    // changer
    currentCoursier: Coursier = null;

    constructor(public postSrv: PostService, private getSrv: GetService,
        private deleteSrv: DeleteService, public dialog: MatDialog, public formBuild: FormBuilder,public formatter: FormatterService) { }

    ngOnInit() {
        this.initCoursier();
        this.initTypeCoursier()
        this.initForm();
    }
    ngAfterViewInit() {
        this.coursierDatasource.paginator = this.coursierPaginator;
    }

    initForm() {
        this.coursierForm = this.formBuild.group({
            nomCou: ['', Validators.required],
            prenomCou: ['', Validators.required],
            numTelCou: ['', Validators.required],
            numTelUrgentCou: ["", Validators.required],
            adresseCou: ["", Validators.required],
            referenceVehiculeCou: ["", Validators.required],
            usernameCou: ['', Validators.required],
            passCou: ['', Validators.required],
            idTypeCouTypeCoursier: [null, Validators.required],
        });
    }

    initCoursier() {
        this.coursierSub = this.getSrv.coursierSubject.subscribe(
            (result: any) => {
                this.coursiers = result;
                this.coursierDatasource.data = this.coursiers
            }
        );
        this.getSrv.getCoursiers()
    }
    initTypeCoursier() {
        this.getSrv.typeCoursierSubject.subscribe(
            (result: any) => {
                this.typeCoursier = result;
            }
        );
        this.getSrv.getAllTypeCoursier()
    }

    addCoursier(formDirective: FormGroupDirective) {
        this.postSrv.addCoursier(this.coursierForm.value).subscribe((res) => {
            this.getSrv.getCoursiers()
            formDirective.resetForm();
            this.coursierForm.reset();
        }, (error) => {
            let isError = error.error.errors;
            if (isError) {
                for (const err of error.error.errors) {
                    console.log(err)
                    this.coursierForm.get(err["param"]).setErrors({ serverError: err["msg"] })
                }
            } else {
                console.log(error)
            }
        })
    }

    // changer
    deleteCoursier(coursier: Coursier) {
        this.currentCoursier = coursier;
        open();
    }

    // changer
    confirmDelete() {
        this.deleteSrv.deleteCoursier(this.currentCoursier.idCou);
        this.currentCoursier = null;
        close();
    }

    // changer
    editCoursier(coursier: Coursier) {
        const id = coursier.idCou;
        const nom = coursier.nomCou;
        const prenom = coursier.prenomCou;
        const tel = coursier.numTelCou;
        const telUrg = coursier.numTelUrgentCou;
        const ref = coursier.referenceVehiculeCou;
        const adresse = coursier.adresseCou;
        const username = coursier.usernameCou;
        const pass = coursier.passCou;
        const type = coursier["idTypeCouTypeCoursier"].idTypeCou
        const typeCoursier = this.typeCoursier

        const dialogRef = this.dialog.open(DetailCoursierComponent, { data: { id, nom, prenom, tel, telUrg, adresse, ref, username, pass, type, typeCoursier } });
        dialogRef.afterClosed().subscribe(
            result => {
                // this.getSrv.getAllTypeProduit();
            }
        );
    }


    filterCoursier(value: string) {
        this.coursierDatasource.filter = value.trim().toLowerCase();
    }
}
