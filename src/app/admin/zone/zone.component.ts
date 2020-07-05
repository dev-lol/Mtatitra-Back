import { DeleteService } from './../services/delete.service';
import { DetailZoneComponent } from './detail-zone/detail-zone.component';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { GetService } from './../services/get.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from './../../admin/services/post.service';
import { Subscription } from 'rxjs';
import { faPlusCircle, faEdit, faMinusCircle, faMapMarked } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// changer
function open() {
    document.getElementById('btn_open').click();
}

function close() {
    document.getElementById('close').click();
}

export interface Zone {
    idZon: number;
    nomZon: string;
    detailsZon: string;
}

@Component({
    selector: 'app-zone',
    templateUrl: './zone.component.html',
    styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit {
    img = '../../../assets/images/zone.png';

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    zoneSub: Subscription;

    columnZone: string[] = ['idZon', 'nomZon', 'detailsZon', 'edit', 'suppr'];
    zones: Zone[] = []
    dataSource = new MatTableDataSource(this.zones);

    faPlusCircle = faPlusCircle;
    faEdit = faEdit;
    faMinusCircle = faMinusCircle;
    faLocation = faMapMarked;

    zoneForm: FormGroup

    // changer
    currentZone: Zone = null;
    constructor(private postSrv: PostService, private getSrv: GetService, public dialog: MatDialog,
        public deleteSrv: DeleteService, private fb: FormBuilder) { }

    ngOnInit() {
        this.initZone();
        this.zoneForm = this.fb.group({
            nomZon: ['', Validators.required],
            detailsZon: ['', Validators.required],
        })
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator
    }

    initZone() {
        this.zoneSub = this.getSrv.zoneSubject.subscribe(
            (zones: any[]) => {
                this.zones = zones;
                this.dataSource.data = this.zones
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

    // changer
    deleteZone(zone: Zone) {
        this.currentZone = zone;
        open();
    }

    // changer
    confirmDelete() {
        this.deleteSrv.deleteZone(this.currentZone.idZon);
        this.currentZone = null;
        close();
    }

    editZone(zone: Zone) {
        const id = zone.idZon;
        const designation = zone.nomZon;
        const details = zone.detailsZon;
        const dialogRef = this.dialog.open(DetailZoneComponent, { data: { id, designation, details } });
        dialogRef.afterClosed().subscribe(
            result => {
                // this.getSrv.getAllTypeProduit();
            }
        );
    }


}
