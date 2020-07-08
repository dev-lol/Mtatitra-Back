import { Subscription } from 'rxjs';
import { GetService } from './../services/get.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faEye } from '@fortawesome/free-solid-svg-icons'; // changer
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js'; // changer
import { Label, Color } from 'ng2-charts'; // changer
import { FormatterService } from '../services/formatter.service';

interface Client {
    idCli: number;
    nomCli: string;
    prenomCli: string;
    numTelCli: string;
    adresseCli: string;
    emailCli: string;
}

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
    @ViewChild(MatPaginator, { static: false }) clientPaginator: MatPaginator;
    faSearch = faSearch;
    faEye = faEye; // changer

    top = "10"; // changer

    clients: Client[] = [];
    columnClients: string[] = ['idCli', 'nomCli', 'prenomCli', 'numTelCli', 'adresseCli', 'emailCli'];
    clientSub: Subscription;

    img = '../../../assets/images/client.png';

    clientDatasource = new MatTableDataSource<Client>(this.clients);


    // changer
    showGraph = false;
    imgGraph = '../../../assets/images/graph.jpg';
    // Line chart
    barData: number[] = []; // OnInit
    barLabel: string[] = []; // OnInit
    barChartOptions: ChartOptions = {
        responsive: true,
    };
    barChartLabels: Label[] = [];
    barChartType: ChartType = 'bar';
    barChartLegend = true;
    barChartPlugins = [];
    barChartData: ChartDataSets[] = [
        {
            data: [], label: ''
        }
    ];
    barChartColors: Color[] = [
        {
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 38, 255, 0.8)',
        }
    ];
    graphSub: Subscription;
    graph: any[];

    constructor(private getSrv: GetService, public formatter: FormatterService) { }
    today = new Date();
    startDate: Date = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1);;
    endDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), 0);
    ngOnInit() {
        // changer
        this.updateLineGraph();
        this.graphSub = this.getSrv.graphClientSubject.subscribe(
            (result: any) => {
                this.graph = result;
                console.log(this.graph)
                this.loadGraph(this.graph);
            }
        );

        this.clientSub = this.getSrv.clientSubject.subscribe(
            (result: any[]) => {
                this.clients = result;
                this.clientDatasource.data = this.clients;
            }
        );
        this.getDataGraph()
        this.getClients();
    }
    ngAfterViewInit() {
        this.clientDatasource.paginator = this.clientPaginator;
    }

    getClients() {
        this.getSrv.getClient();
    }

    filterClient(value: string) {
        this.clientDatasource.filter = value.trim().toLowerCase();
    }

    // changer
    getDataGraph() {
        this.getSrv.getGraphTopLivraison(this.startDate, this.endDate, Number(this.top));
    }
    loadGraph(data: any) {
        this.barData = [];
        this.barLabel = [];
        data.forEach(item => {
            this.barData.push(item.total);
        });

        data.forEach(item => {
            this.barLabel.push(item.nomCli + ' ' + item.prenomCli);
        });
        this.updateLineGraph();
    }


    // changer
    updateLineGraph() {
        this.barChartData[0] = Object.assign({}, this.barChartData[0], { data: this.barData });
        this.barChartLabels = [];
        this.barChartLabels = this.barLabel;
    }

    // changer
    toggleGraph() {
        this.showGraph = !this.showGraph;
    }

    // changer
    changeTop() {
        const dateStart = this.startDate.toISOString();
        const dateEnd = this.startDate.toISOString();
        this.getSrv.getGraphTopLivraison(dateStart, dateEnd, Number(this.top));
    }

}
