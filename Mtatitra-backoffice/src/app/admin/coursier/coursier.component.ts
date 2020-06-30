import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DetailCoursierComponent } from './detail-coursier/detail-coursier.component';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { DeleteService } from './../services/delete.service';
import { GetService } from './../services/get.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { faEyeSlash, faMailBulk, faUser, faUserAlt, faUserAltSlash, faPhone, faEyeDropper, faCarAlt } from '@fortawesome/free-solid-svg-icons';
import { PostService } from './../../admin/services/post.service';
import { faPlusCircle, faEdit, faMinusCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TypeCoursier } from '../type/type.component';
import { catchError } from 'rxjs/operators';

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
    columnCoursiers: string[] = ['idCou', 'nomCou', 'prenomCou', 'numTelCou', 'usernameCou', 'typeCoursier', 'edit', 'suppr'];
    coursierSub: Subscription;

    selectedType = 'init';
    passConfirm = '';
    coursierAdded = {
        nomCou: '',
        prenomCou: '',
        numTelCou: '',
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

    coursierForm: FormGroup;

    // changer
    currentId = 0;

    constructor(public postSrv: PostService, private getSrv: GetService,
        private deleteSrv: DeleteService, public dialog: MatDialog, public formBuild: FormBuilder) { }

    ngOnInit() {
        this.initCoursier();
        this.initTypeCoursier()
        this.initForm();
        this.coursierDatasource.paginator = this.coursierPaginator;
    }

    initForm() {
        this.coursierForm = this.formBuild.group({
            nomCou: ['', Validators.required],
            prenomCou: ['', Validators.required],
            numTelCou: ['', Validators.required],
            usernameCou: ['', Validators.required],
            passCou: ['', Validators.required],
            idTypeCou: [null, Validators.required],
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

    addCoursier() {
        this.postSrv.addCoursier(this.coursierForm.value).subscribe((res) => {
            this.coursierForm.reset();
            this.getSrv.getCoursiers()
        })
    }

    // changer
    deleteCoursier(id: number) {
        this.currentId = id;
        open();
    }

    // changer
    confirmDelete() {
        this.deleteSrv.deleteCoursier(this.currentId);
        this.currentId = 0;
        close();
    }

    editCoursier(index: number) {
        const id = this.coursiers[index].idCou;
        const nom = this.coursiers[index].nomCou;
        const prenom = this.coursiers[index].prenomCou;
        const tel = this.coursiers[index].numTelCou;
        const username = this.coursiers[index].usernameCou;
        const pass = this.coursiers[index].passCou;
        const type = this.coursiers[index]["idTypeCouTypeCoursier"].idTypeCou
        const typeCoursier = this.typeCoursier

        const dialogRef = this.dialog.open(DetailCoursierComponent, { data: { id, nom, prenom, tel, username, pass, type, typeCoursier} });
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