import { DetailTarifComponent } from './detail-tarif/detail-tarif.component';
import { DeleteService } from './../services/delete.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { GetService } from './../services/get.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from './../../admin/services/post.service';
import { Subscription } from 'rxjs';
import { faPlusCircle, faEdit, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';

function open() {
    document.getElementById('btn_open').click();
}

function close() {
    document.getElementById('close').click();
}

interface Tarif {
    idTar: number;
    tarifTar: number;
    idZonDepart: any;
    idZonArrivee: any;
    idTypeCouTypeCoursier: any;
}

interface TypeCoursier {
    idTypeCou: number;
    typeCou: string;
    estSupprime: boolean;
}

interface Zone {
    idZon: number;
    nomZon: string;
    estSupprime: boolean;
}

@Component({
    selector: 'app-tarif',
    templateUrl: './tarif.component.html',
    styleUrls: ['./tarif.component.css']
})
export class TarifComponent implements OnInit {

    autreErreur = null
    img = '../../../assets/images/tarif.png';

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    tarifSub: Subscription;

    columnTarif: string[] = ['idTar', 'tarifTar', 'zoneA', 'zoneB', 'typeCou', 'edit', 'suppr'];
    tarifs: Tarif[] = [];
    zones: Zone[] = []
    coursiers: TypeCoursier[] = []
    dataSource = new MatTableDataSource(this.tarifs)

    faPlusCircle = faPlusCircle;
    faEdit = faEdit;
    faMinusCircle = faMinusCircle;

    currentTarif: Tarif = null;
    zoneSub: Subscription;
    coursiersSub: Subscription;

    formTarif: FormGroup

    constructor(private postSrv: PostService, private getSrv: GetService, public dialog: MatDialog,
        public deleteSrv: DeleteService, private fb: FormBuilder) { }

    ngOnInit() {
        this.initTarif();
        this.formTarif = this.fb.group({
            tarifTar: ['', Validators.required],
            idZonDepart: ['', Validators.required],
            idZonArrivee: ['', Validators.required],
            idTypeCouTypeCoursier: ['', Validators.required],
        })
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator
        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'zoneA': return item.idZonDepart.nomZon;
                case 'zoneB': return item.idZonArrivee.nomZon;
                case 'typeCou': return item.idTypeCouTypeCoursier.typeCou
                default: return item[property];
            }
        }
        this.dataSource.filterPredicate = (data, filter) => {
            return data.idTar.toString().trim().toLowerCase().includes(filter)
                || data.tarifTar.toString().trim().toLowerCase().includes(filter)
                || data.idZonArrivee.nomZon.toString().trim().toLowerCase().includes(filter)
                || data.idZonDepart.nomZon.toString().trim().toLowerCase().includes(filter)
                || data.idTypeCouTypeCoursier.typeCou.toString().trim().toLowerCase().includes(filter)
        }
        this.dataSource.sort = this.sort
    }

    initTarif() {
        this.tarifSub = this.getSrv.tarifSubject.subscribe(
            (tarifs: any[]) => {
                this.tarifs = tarifs;
                this.dataSource.data = this.tarifs;
            }
        );

        this.zoneSub = this.getSrv.zoneSubject.subscribe(
            (zones: any[]) => {
                this.zones = zones;
            }
        );

        this.coursiersSub = this.getSrv.typeCoursierSubject.subscribe(
            (types: any[]) => {
                this.coursiers = types;
            }
        );
        this.getSrv.getTarif();
        this.getSrv.getZone();
        this.getSrv.getAllTypeCoursier();
    }

    addTarif(formDirective: FormGroupDirective) {
        this.autreErreur = null
        this.postSrv.addTarif(this.formTarif.value).subscribe((res) => {
            this.getSrv.getTarif()
            formDirective.resetForm()
            this.formTarif.reset()
        }, (error: any) => {
            let isError = error.error.errors;
            if (isError) {
                for (const err of error.error.errors) {
                    this.formTarif.get(err["param"]).setErrors({ serverError: err["msg"] })
                }
            } else {
                if (error.error.message) {
                    this.autreErreur = error.error.message
                }
            }
        })
    }

    deleteTarif(tarif: Tarif) {
        this.currentTarif = tarif;
        open();
    }

    confirmDelete() {
        this.deleteSrv.deleteTarif(this.currentTarif.idTar);
        this.currentTarif = null;
        close();
    }

    editTarif(tarif: Tarif) {
        const id = tarif.idTar;
        const tar = tarif.tarifTar;
        const zoneB = tarif.idZonArrivee;
        const zoneA = tarif.idZonDepart;
        const typeCoursier = tarif.idTypeCouTypeCoursier;
        const typeCoursiers = this.coursiers
        const zones = this.zones
        const dialogRef = this.dialog.open(DetailTarifComponent, { data: { id, tar, zoneA, zoneB, typeCoursier, zones, typeCoursiers } });
        dialogRef.afterClosed().subscribe(
            result => {
                // this.getSrv.getAllTypeLivraison();
            }
        );
    }
    filter(val) {
        this.dataSource.filter = val.trim().toLowerCase();
    }
}
