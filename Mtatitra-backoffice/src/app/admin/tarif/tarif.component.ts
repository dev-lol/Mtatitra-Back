import { DetailTarifComponent } from './detail-tarif/detail-tarif.component';
import { DeleteService } from './../services/delete.service';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { GetService } from './../services/get.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from './../../admin/services/post.service';
import { Subscription } from 'rxjs';
import { faPlusCircle, faEdit, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function open() {
    document.getElementById('btn_open').click();
}

function close() {
    document.getElementById('close').click();
}

interface Tarif {
    idTar: number;
    tarifTar: number;
    idZonZone: any;
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
    img = '../../../assets/images/tarif.png';

    tarifAdded = 0;
    tarifSub: Subscription;

    columnTarif: string[] = ['idTar', 'tarifTar', 'nomZon', 'typeCou', 'edit', 'suppr'];
    tarifs: Tarif[] = [];
    dataSource = new MatTableDataSource(this.tarifs)
    coursiers: TypeCoursier[] = [];

    zones: Zone[] = [];

    faPlusCircle = faPlusCircle;
    faEdit = faEdit;
    faMinusCircle = faMinusCircle;

    currentId = 0;
    currentIdZone = 0;
    currentIdTypeCoursier = 0;
    zoneSub: Subscription;
    coursiersSub: Subscription;

    constructor(private postSrv: PostService, private getSrv: GetService, public dialog: MatDialog,
        public deleteSrv: DeleteService) { }

    ngOnInit() {
        this.initTarif();
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

    addTarif() {
        const data: any = {
            tarifTar: this.tarifAdded,
            idZonZone: this.currentIdZone,
            idTypeCouTypeCoursier: this.currentIdTypeCoursier
        };
        console.log(data);
        this.postSrv.addTarif(data);
        this.tarifAdded = 0;
        this.currentIdZone = 0;
        this.currentIdTypeCoursier = 0;
    }

    deleteTarif(id: number) {
        this.currentId = id;
        open();
    }

    confirmDelete() {
        this.deleteSrv.deleteTarif(this.currentId);
        this.currentId = 0;
        close();
    }

    editTarif(index: number) {
        const id = this.tarifs[index].idTar;
        const tarif = this.tarifs[index].tarifTar;
        const zone = this.tarifs[index].idZonZone;
        const typeCoursier = this.tarifs[index].idTypeCouTypeCoursier;
        const typeCoursiers = this.coursiers
        const zones = this.zones
        const dialogRef = this.dialog.open(DetailTarifComponent, { data: { id, tarif, zone, typeCoursier, zones, typeCoursiers } });
        dialogRef.afterClosed().subscribe(
            result => {
                // this.getSrv.getAllTypeLivraison();
            }
        );
    }
    filter(value) {
        this.dataSource.filter = value.trim().toLowerCase();
    }
}
