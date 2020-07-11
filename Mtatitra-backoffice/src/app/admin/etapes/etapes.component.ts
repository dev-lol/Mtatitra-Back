import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { GetService } from '../services/get.service';
import { faEdit, faCheck, faWindowClose, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { PutService } from '../services/put.service';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { PostService } from '../services/post.service';
import { DetailResultatComponent } from './detail-resultat/detail-resultat.component';
import { DeleteService } from '../services/delete.service';


function open() {
    document.getElementById('btn_open').click();
}

function close() {
    document.getElementById('close').click();
}

@Component({
    selector: 'app-etapes',
    templateUrl: './etapes.component.html',
    styleUrls: ['./etapes.component.css']
})

export class EtapesComponent implements OnInit {



    faEdit = faEdit
    faCheck = faCheck
    faClose = faWindowClose

    faPlusCircle = faPlusCircle;
    faMinusCircle = faMinusCircle;

    columnResultat: string[] = ['idRes', 'resultatRes', 'edit', 'suppr'];
    resultatAdded = ""
    currentRes: Resultat = null
    resultats: Resultat[] = []
    resultatDataSource: MatTableDataSource<Resultat> = new MatTableDataSource(this.resultats);

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
    constructor(private getSrv: GetService, private putSrv: PutService, private deleteSrv: DeleteService, private postSrv: PostService, public dialog: MatDialog) { }
    ngOnInit() {
        this.getSrv.etapesSubject.subscribe((res) => {
            console.log(res)
            this.etapes = res;
            this.oldEtapes = res.map(a => ({ ...a }));
        })
        this.getSrv.resultatSubject.subscribe((res) => {
            console.log(res)
            this.resultats = res
            this.resultatDataSource.data = res
        })
        this.getSrv.getEtapes()
        this.getSrv.getResultat()
    }

    ngAfterViewInit() {
        this.resultatDataSource.paginator = this.paginator
    }
    oldEtapes: Etape[] = []
    etapes: Etape[] = [];
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.etapes, event.previousIndex, event.currentIndex);
        for (const [index, etape] of Object.entries(this.etapes)) {
            etape.ordreEta = Number(index)
        }
    }
    edit(etape: Etape) {
        this.editMode = true
        this.currentEdit = etape
        this.modifiedEtape = etape.etatEta
    }
    exit(etape) {
        if (this.isAdding) {
            this.etapes.splice(this.etapes.indexOf(etape), 1)
        }
        this.editMode = false
        this.currentEdit = null
        this.modifiedEtape = ""
    }
    save(etape: Etape) {
        this.isAdding = false
        etape.etatEta = this.modifiedEtape
        this.exit(etape)
    }

    currentEdit: Etape = null
    modifiedEtape = ""
    editMode = false
    get isChanged() { return this.etapes.length != this.oldEtapes.length || JSON.stringify(this.etapes) != JSON.stringify(this.oldEtapes) }

    reset() {
        this.etapes = this.oldEtapes.map(a => ({ ...a }))
    }
    submit() {
        this.putSrv.editEtape({ etapes: this.etapes })
    }
    isAdding = false
    add() {
        this.isAdding = true
        let newEtape = { idEta: null, etatEta: "", ordreEta: this.etapes.length }
        this.etapes.push(newEtape)
        this.edit(newEtape)
    }
    remove(etape) {
        this.etapes.splice(this.etapes.indexOf(etape), 1)
        for (const [index, etape] of Object.entries(this.etapes)) {
            etape.ordreEta = Number(index)
        }
    }

    addResultat() {
        this.postSrv.addResultat({ resultatRes: this.resultatAdded }).subscribe(res => {
            this.getSrv.getResultat()
        }, error => console.log(error))
    }

    deleteResultat(res: Resultat) {
        this.currentRes = res;
        open();
    }
    editResultat(res: Resultat) {
        const id = res.idRes;
        const designation = res.resultatRes;
        const dialogRef = this.dialog.open(DetailResultatComponent, { data: { type: 'coursier', id, designation } });
        dialogRef.afterClosed().subscribe(
            result => {
                // this.getSrv.getAllTypeCoursier();
            }
        );
    }

    confirmDelete() {
        this.deleteSrv.deleteResultat(this.currentRes.idRes);
        this.currentRes = null;
        close();
    }
}

export interface Etape {
    idEta: number | null
    etatEta: string;
    ordreEta: number
}

export interface Resultat {
    idRes: number;
    resultatRes: string;
}