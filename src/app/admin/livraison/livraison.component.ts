import { PutService } from './../services/put.service';
import { GetService } from './../services/get.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

interface Produit {
    idPro: number;
    fragilePro: boolean;
    consignePro: string;
    prixPro: number;
    typePro: string;
}

// changer
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
    styleUrls: ['./livraison.component.css']
})
export class LivraisonComponent implements OnInit {
    img = '../../../assets/images/livrai.png';


    // changer
    livraisons: Livraison[] = [];

    currentIdCoursier = 0;

    // changer
    selectedValue: any = 'all';
    dateValue: any = new Date().toISOString();

    // changer
    showGraph = false;
    imgGraph = '../../../assets/images/graph.jpg';
    // Line chart
    lineData: number[] = [12, 23, 33, 40, 10, 38]; // OnInit
    lineLabel: string[] = ['02-01-2020', '03-01-2020', '04-01-2020', '05-01-2020', '06-01-2020', '07-01-2020']; // OnInit
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
    // fin changer

    constructor(public getSrv: GetService, public putSrv: PutService) { }

    ngOnInit() {
        const date = new Date(this.dateValue).toDateString();
            // changer
            this.graphSub = this.getSrv.graphSubject.subscribe(
                (result: any) => {
                    this.graph = result;
                    this.loadGraph(this.graph);
                }
            );
        this.getSrv.livSubject.subscribe(
            (result: any) => {
                this.livraisons = result;
                console.log(result)
            }
        );
        this.getSrv.getAllLivraison(this.selectedValue, date)

        this.getSrv.getCoursiers();
        this.getDataGraph();  // changer
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
    // changer
    changeSelection() {
        if (this.selectedValue && this.dateValue) {
            const date = new Date(this.dateValue).toDateString();
            this.getSrv.getAllLivraison(this.selectedValue, date);
        }
    }

    // changer
    getDataGraph() {
        this.updateLineGraph();
        this.getSrv.getGraphLivraison();
    }

    // changer
    loadGraph(data: any) {
        this.lineData = [];
        this.lineLabel = [];
        data.forEach(nbLivraison => {
            this.lineData.push(nbLivraison);
        });

        data.forEach(dateLivraison => {
            this.lineLabel.push(dateLivraison);
        });
        this.updateLineGraph();
    }

    // changer
    updateLineGraph() {
        this.lineChartData[0] = Object.assign({}, this.lineChartData[0], { data: this.lineData });
        this.lineChartLabels = [];
        this.lineChartLabels = this.lineLabel;
    }

    // changer
    toggleGraph() {
        this.showGraph = !this.showGraph;
    }


}
