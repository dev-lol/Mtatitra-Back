import { PutService } from './../services/put.service';
import { GetService } from './../services/get.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';    // changer
import { AppDateAdapter, APP_DATE_FORMATS } from './../format-datepicker';    // changer
import { faEye } from '@fortawesome/free-solid-svg-icons'; // changer 2
import { FormatterService } from '../services/formatter.service';
import { Router, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';
import { RapportComponent } from './rapport/rapport.component';
import { Resultat } from '../etapes/etapes.component';
import { FormRapportComponent } from './form-rapport/form-rapport.component';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';


interface Produit {
    idPro: number;
    fragilePro: boolean;
    consignePro: string;
    prixPro: number;
    typePro: string;
}

interface Livraison {
    idLiv: number;
    idLieDepart: any;
    idLieArrivee: any;
    numRecepLiv: string;
    dateLiv: string;
    nomCou?: string;
    prenomCou?: string;
    produits: Produit[];

    idCouCoursier: any | null;
    idResResultat: any;
    rapportLiv: string | null;
}

interface Coursier {
    idCou: number;
    nomCou: string;
    prenomCou: string;
}

@Component({
    selector: 'app-livraison',
    templateUrl: './livraison.component.html',
    styleUrls: ['./livraison.component.css'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})
export class LivraisonComponent implements OnInit {
    img = '../../../assets/images/livrai.png';

    faEye = faEye; // changer 2
    livraisons: Livraison[] = [];
    livraisonsRaw: Livraison[] = []

    resultats: Resultat[] = []

    currentIdCoursier = {
    };
    livraisonSub: Subscription;
    dateValue: Date = new Date();

    value

    // changer
    showGraph = false;
    imgGraph = '../../../assets/images/graph.jpg';
    // Line chart
    lineData: number[] = []; // OnInit
    lineLabel: string[] = []; // OnInit
    lineChartOptions: ChartOptions = {
        responsive: true,
    };
    lineChartLabels: Label[] = [];
    lineChartType: ChartType = 'line';
    lineChartLegend = true;
    lineChartPlugins = [];
    lineChartData: ChartDataSets[] = [
        {
            data: [], label: ''
        }
    ];
    lineChartColors: Color[] = [
        {
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 38, 255, 0.8)',
        }
    ];
    graphSub: Subscription;
    graph: any[];


    // changer
    tmp = new Date();
    today = new Date(this.tmp.getFullYear(), this.tmp.getMonth(), this.tmp.getDate())
    startDate: Date = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1);;
    endDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), 0);



    formArray: FormArray

    constructor(private fb: FormBuilder, public getSrv: GetService, public putSrv: PutService, public formatter: FormatterService, private router: Router, public dialog: MatDialog) { }


    ngOnInit() {
        let params: ParamMap = this.router.parseUrl(this.router.url).queryParamMap
        if (params.has("date")) {
            this.dateValue = new Date(params.get("date"))
        }
        if (params.has("id")) {
            this.value = params.get("id")
            this.filter()
        }
        this.changeSelection()

        this.formArray = this.fb.array([])

        this.graphSub = this.getSrv.graphSubject.subscribe(
            (result: any) => {
                this.graph = result;
                this.loadGraph(this.graph);
            }
        );

        this.livraisonSub = this.getSrv.livSubject.subscribe(
            (result: any) => {
                this.livraisons = result;
                for (const liv of result) {
                    this.currentIdCoursier[liv.idLiv] = liv.idCouCoursier ? liv.idCouCoursier.idCou : 0;
                }
                console.log(this.currentIdCoursier)
                this.livraisonsRaw = result;
                this.filter();
            }
        );

        this.getSrv.resultatSubject.subscribe((res: any) => {
            this.resultats = res
        })

        this.getSrv.getResultat()
        this.getDataGraph();
        this.getAllLivraisons();
    }

    addControl() {
        this.formArray.push(new FormControl(''))
    }

    getAllLivraisons() {
        this.getSrv.getAllLivraison(this.dateValue.toISOString());
    }

    assigne(idLiv: number) {
        this.putSrv.assigneCoursierLivraison(idLiv, this.currentIdCoursier[idLiv]);
    }

    changeDate() {
        this.changeSelection();
    }

    changeSelection() {
        let date = null;
        if (this.dateValue) {
            date = new Date(this.dateValue).toDateString()
        }
        this.getSrv.getAllLivraison(date);
    }

    getDataGraph() {
        this.getSrv.getGraphByDate(this.startDate, this.endDate);
    }
    loadGraph(data: any) {
        this.lineData = [];
        this.lineLabel = [];
        data.forEach(item => {
            this.lineData.push(item.count)
            this.lineLabel.push(item.date_liv.substring(0, 10))
        });
        this.updateLineGraph();
    }


    updateLineGraph() {
        this.lineChartData[0] = Object.assign({}, this.lineChartData[0], { data: this.lineData });
        this.lineChartLabels = [];
        this.lineChartLabels = this.lineLabel;
    }

    toggleGraph() {
        this.showGraph = !this.showGraph;
    }

    // changer
    changeDateGraph() {
        const dateStart = this.startDate.toISOString();
        const dateEnd = this.endDate.toISOString();
        this.getSrv.getGraphByDate(dateStart, dateEnd);
    }

    filter() {
        if (this.value) {
            this.livraisons = this.livraisonsRaw.filter((value) => value.idLiv == this.value)
        } else {
            this.livraisons = this.livraisonsRaw
        }
    }

    voirRapport(liv) {
        const dialogRef = this.dialog.open(RapportComponent, { data: { resultat: liv.idResResultat, rapport: liv.rapportLiv, resultats: this.resultats } });
        dialogRef.afterClosed().subscribe(
            result => {
            }
        );
    }

    annuler(liv) {
        const dialogRef = this.dialog.open(FormRapportComponent, { data: { resultat: liv.idResResultat, rapport: liv.rapportLiv, resultats: this.resultats, idLiv: liv.idLiv } });
        dialogRef.afterClosed().subscribe(
            result => {
            }
        );
    }
}
