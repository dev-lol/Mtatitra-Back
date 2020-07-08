import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { GetService } from '../services/get.service';
import { faEdit, faCheck, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { PutService } from '../services/put.service';

@Component({
    selector: 'app-etapes',
    templateUrl: './etapes.component.html',
    styleUrls: ['./etapes.component.css']
})
export class EtapesComponent implements OnInit {

    faEdit = faEdit
    faCheck = faCheck
    faClose = faWindowClose
    constructor(private getSrv: GetService, private putSrv: PutService) { }
    ngOnInit() {
        this.getSrv.etapesSubject.subscribe((res) => {
            console.log(res)
            this.etapes = res;
            this.oldEtapes = res.map(a => ({ ...a }));
        })
        this.getSrv.getEtapes()
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
}

export interface Etape {
    idEta: number | null
    etatEta: string;
    ordreEta: number
}