import { Component, OnInit } from '@angular/core';
import { TarifService } from './tarif.service';
import { MatSelectChange } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-tarif',
    templateUrl: './tarif.component.html',
    styleUrls: ['./tarif.component.css']
})
export class TarifComponent implements OnInit {

    tarif = []
    constructor(
        private spinner: NgxSpinnerService,
        private tarifService: TarifService
    ) { }

    ngOnInit() {
        this.spinner.show("tarif")
        this.tarifService.getTarif().subscribe((res: any) => {
            this.tarif = res
            this.spinner.hide("tarif")
        })
    }
}
