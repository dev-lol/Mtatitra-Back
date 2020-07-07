import { DeleteService } from './../services/delete.service';
import { DetailZoneComponent } from './detail-zone/detail-zone.component';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { GetService } from './../services/get.service';
import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { PostService } from './../../admin/services/post.service';
import { Subscription } from 'rxjs';
import { faPlusCircle, faEdit, faMinusCircle, faMapMarked } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DetailLieuComponent } from './detail-lieu/detail-lieu.component';

// changer
function open() {
    document.getElementById('btn_open').click();
}

function close() {
    document.getElementById('close').click();
}

enum deleteType { zone, lieu };

export interface Zone {
    idZon: number;
    nomZon: string;

    lieu: Lieu[];
}

export interface Lieu {
    idLie: number;
    nomLie: string;
}

@Component({
    selector: 'app-zone',
    templateUrl: './zone.component.html',
    styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit {
    img = '../../../assets/images/zone.png';

    @ViewChild('zonePaginator', { static: false }) paginator: MatPaginator;
    @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;

    @ViewChild('zoneSort', { static: false }) sort: MatSort;
    @ViewChildren(MatSort) sorts: QueryList<MatSort>;

    zoneSub: Subscription;

    currentZoneTab: Zone
    currentTab: number = 0

    columnZone: string[] = ['idZon', 'nomZon', 'edit', 'suppr'];
    columnLieu: string[] = ['idLie', 'nomLie', 'edit', 'suppr'];
    zones: Zone[] = []

    dataSource = new MatTableDataSource<Zone>(this.zones);

    dataSources = {}

    faPlusCircle = faPlusCircle;
    faEdit = faEdit;
    faMinusCircle = faMinusCircle;
    faLocation = faMapMarked;

    zoneForm: FormGroup
    lieuForm: FormGroup

    deleteType: deleteType = null
    // changer
    currentZone: Zone = null;
    currentLieu: Lieu = null;
    constructor(private postSrv: PostService, private getSrv: GetService, public dialog: MatDialog,
        public deleteSrv: DeleteService, private fb: FormBuilder) { }

    ngOnInit() {
        this.initZone();
        this.zoneForm = this.fb.group({
            nomZon: ['', Validators.required],
        })
        this.lieuForm = this.fb.group({
            nomLie: ['', Validators.required],
            idZonZone: ['', Validators.required],
        })
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
    }

    initZone() {
        this.zoneSub = this.getSrv.zoneSubject.subscribe(
            (zones: any[]) => {
                this.zones = zones;
                this.currentZoneTab = this.zones[this.currentTab]
                this.dataSource.data = this.zones
                setTimeout(() => {
                    for (let [index, zone] of zones.entries()) {
                        if (!Object.keys(this.dataSources).includes(zone.idZon)) {
                            this.dataSources[zone.idZon] = new MatTableDataSource<Lieu>(zone.lieu)
                            this.dataSources[zone.idZon].paginator = this.paginators.toArray()[index + 1]
                            this.dataSources[zone.idZon].sort = this.sorts.toArray()[index + 1]
                        }
                        else {
                            this.dataSources[zone.idZon].data = zone.lieu
                        }
                    };
                }, 200)
            }
        );
        this.getAllZone();
    }

    getAllZone() {
        this.getSrv.getZone();
    }

    addZone() {
        this.postSrv.addZone(this.zoneForm.value).subscribe((res) => {
            this.zoneForm.reset()
            this.getSrv.getZone()
        })
    }

    addLieu() {
        console.log(this.lieuForm.value)
        this.postSrv.addLieu(this.lieuForm.value).subscribe((res) => {
            this.lieuForm.reset()
            this.getSrv.getZone()
        })
    }

    // changer
    deleteZone(zone: Zone) {
        this.deleteType = deleteType.zone
        this.currentZone = zone;
        open();
    }

    deleteLieu(lieu: Lieu) {
        this.deleteType = deleteType.lieu
        this.currentLieu = lieu;
        open();
    }

    // changer
    confirmDelete() {
        switch (this.deleteType) {
            case deleteType.lieu:
                this.deleteSrv.deleteLieu(this.currentLieu.idLie)
                this.currentLieu = null;
                break
            case deleteType.zone:
                this.deleteSrv.deleteZone(this.currentZone.idZon);
                this.currentZone = null;
                break
        }
        this.deleteType = null
        close();
    }

    editZone(zone: Zone) {
        const id = zone.idZon;
        const designation = zone.nomZon;
        const dialogRef = this.dialog.open(DetailZoneComponent, { data: { id, designation } });
        dialogRef.afterClosed().subscribe(
            result => {
                // this.getSrv.getAllTypeProduit();
            }
        );
    }

    editLieu(lieu: Lieu) {
        const id = lieu.idLie;
        const designation = lieu.nomLie;
        const zone = this.currentZoneTab
        const zones = this.zones
        const dialogRef = this.dialog.open(DetailLieuComponent, { data: { id, designation, zones, zone } });
        dialogRef.afterClosed().subscribe(
            result => {
                // this.getSrv.getAllTypeProduit();
            }
        );
    }

    onChangeTab(event) {
        this.currentZoneTab = this.zones[this.currentTab]
        console.log(this.currentZoneTab)
    }

}
