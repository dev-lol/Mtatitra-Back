import { PutService } from './../../services/put.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Resultat } from '../../etapes/etapes.component';
import { PostService } from '../../services/post.service';
import { GetService } from '../../services/get.service';

function close() {
    document.getElementById('btn_close').click();
}


@Component({
    selector: 'app-form-rapport',
    templateUrl: './form-rapport.component.html',
    styleUrls: ['./form-rapport.component.css']
})
export class FormRapportComponent implements OnInit {
    faTimesCircle = faTimesCircle;
    formRapport: FormGroup

    resultats: Resultat[]

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private postSrv: PostService, private getSrv: GetService) { }

    ngOnInit() {
        this.resultats = this.data.resultats
        this.formRapport = this.fb.group({
            idResResultat: ['', Validators.required],
            rapportLiv: ['', Validators.required]
        })
    }

    submitRapport() {
        this.postSrv.postRapport(this.data.idLiv, this.formRapport.value).subscribe(res => {
            this.getSrv.getAllLivraison()
            close()
        }, error => {
            console.log(error)
        })
    }
}
