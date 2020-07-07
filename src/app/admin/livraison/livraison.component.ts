import { PutService } from './../services/put.service';
import { GetService } from './../services/get.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';    // changer
import { AppDateAdapter, APP_DATE_FORMATS } from './../format-datepicker';    // changer
import { faEye } from '@fortawesome/free-solid-svg-icons'; // changer 2


interface Produit {
    idPro: number;
    fragilePro: boolean;
    consignePro: string;
    prixPro: number;
    typePro: string;
}

interface Livraison {
    idLiv: number;
    departLiv: string;
    destinationLiv: string;
    numRecepLiv: string;
    dateLiv: string;
    nomCou?: string;
    prenomCou?: string;
    produits: Produit[];
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

    coursiers: Coursier[] = [];

    currentIdCoursier = 0;
    livraisonSub: Subscription;
    coursiersSub: Subscription;

    selectedValue: any = 'all';
    dateValue: any = new Date();

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
    today = new Date();
    startDate: Date = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1);;
    endDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), 0);

    constructor(public getSrv: GetService, public putSrv: PutService) { }

    ngOnInit() {
        this.graphSub = this.getSrv.graphSubject.subscribe(
            (result: any) => {
                this.graph = result;
                this.loadGraph(this.graph);
            }
        );

        this.livraisonSub = this.getSrv.livSubject.subscribe(
            (result: any) => {
                this.livraisons = result;
            }
        );

        this.coursiersSub = this.getSrv.coursierSubject.subscribe(
            (result: any) => {
                this.coursiers = result;
            }
        );
        this.getSrv.getCoursiers();
        this.getDataGraph();
        this.getAllLivraisons();
    }

    getAllLivraisons() {
        this.getSrv.getAllLivraison();
    }


    changeIdCoursier(id: number) {
        this.currentIdCoursier = id;
    }

    assigne(idLiv: number) {
        this.putSrv.assigneCoursierLivraison(idLiv, this.currentIdCoursier);
    }

    changeDate() {
        this.changeSelection();
    }

    changeSelection() {
        let date = null;
        if (this.dateValue) {
            date = new Date(this.dateValue).toDateString()
        }
        this.getSrv.getAllLivraison(this.selectedValue, date);
    }

    getDataGraph() {
        this.getSrv.getGraphByDate(this.startDate, this.endDate);
    }
    loadGraph(data: any) {
        this.lineData = [];
        this.lineLabel = [];
        data.forEach(item => {
            this.lineData.push(item.count)
            this.lineLabel.push(item.date_liv.substring(0,10))
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

}
