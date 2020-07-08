import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartOptions, ChartType, ChartData, ChartDataSets } from 'chart.js';
import { Label, Color, MultiDataSet, BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { GetService } from '../services/get.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    colors: Color[] = [
        {
            backgroundColor: "rgba(244,67,54,0.8)",
            borderColor: "rgba(183,28,28,0.8)"
        },
        {
            backgroundColor: "rgba(233,30,99,0.8)",
            borderColor: "rgba(136,14,79,0.8)"
        },
        {
            backgroundColor: "rgba(156,39,176,0.8)",
            borderColor: "rgba(74,20,140,0.8)"
        },
        {
            backgroundColor: "rgba(103,58,183,0.8)",
            borderColor: "rgba(49,27,146,0.8)"
        },
        {
            backgroundColor: "rgba(63,81,181,0.8)",
            borderColor: "rgba(26,35,126,0.8)"
        },
        {
            backgroundColor: "rgba(33,150,243,0.8)",
            borderColor: "rgba(13,71,161,0.8)"
        },
        {
            backgroundColor: "rgba(3,169,244,0.8)",
            borderColor: "rgba(1,87,155,0.8)"
        },
        {
            backgroundColor: "rgba(0,188,212,0.8)",
            borderColor: "rgba(0,96,100,0.8)",
        },
        {
            backgroundColor: "rgba(0,150,136,0.8)",
            borderColor: "rgba(0,77,64,0.8)",
        },
        {
            backgroundColor: "rgba(76,175,80,0.8)",
            borderColor: "rgba(27,94,32,0.8)"
        },
        {
            backgroundColor: "rgba(139,195,74,0.8)",
            borderColor: "rgba(51,105,30,0.8)"
        },
        {
            backgroundColor: "rgba(205,220,57,0.8)",
            borderColor: "rgba(130,119,23,0.8)"
        },
        {
            backgroundColor: "rgba(255,235,59,0.8)",
            borderColor: "rgba(245,127,23,0.8)"
        },
        {
            backgroundColor: "rgba(255,193,7,0.8)",
            borderColor: "rgba(255,111,0,0.8)"
        },
        {
            backgroundColor: "rgba(255,152,0,0.8)",
            borderColor: "rgba(230,81,0,0.8)"
        },
        {
            backgroundColor: "rgba(255,87,34,0.8)",
            borderColor: "rgba(191,54,12,0.8)"
        },
        {
            backgroundColor: "rgba(121,85,72,0.8)",
            borderColor: "rgba(62,39,35,0.8)"
        },
        {
            backgroundColor: "rgba(158,158,158,0.8)",
            borderColor: "rgba(33,33,33,0.8)"
        },
        {
            backgroundColor: "rgba(96,125,139,0.8)",
            borderColor: "rgba(38,50,56,0.8)"
        },
    ]



    /* zone */
    zoneData: number[] = []; // OnInit
    zoneLabel: string[] = []; // OnInit
    zoneChartOptions: ChartOptions = {
        responsive: true,
    };
    zoneChartLabels: Label[] = [];
    zoneChartType: ChartType = 'radar';
    zoneChartLegend = true;
    zoneChartPlugins = [];
    zoneChartData: ChartDataSets[] = [
        {
            data: [], label: ''
        }
    ];
    zoneChartColors: Color[] = [
        this.colors[Math.floor(Math.random() * (this.colors.length - 1))]
    ];
    graphZonSub: Subscription;
    graphZon: any[];

    /* zone */

    /*type couriser */

    graphTypeCouSub: Subscription;
    graphTypeCou: any[];

    typeCoursierChartLabels: Label[] = [];
    typeCoursierChartData: MultiDataSet = [];
    typeCoursierChartType: ChartType = 'doughnut';

    typeCoursierColors: Array<any> = [{
        backgroundColor: []
    }]


    /*type couriser */

    /*type pro */
    typeProduitData: number[] = []; // OnInit
    typeProduitLabel: string[] = []; // OnInit
    typeProduitChartOptions: ChartOptions = {
        responsive: true,
    };
    typeProduitChartLabels: Label[] = [];
    typeProduitChartType: ChartType = 'polarArea';
    typeProduitChartLegend = true;
    typeProduitChartPlugins = [];
    typeProduitChartData: ChartDataSets[] = [
        {
            data: [], label: ''
        }
    ];
    typeProduitChartColors = [];
    graphTypeProSub: Subscription;
    graphTypePro: any[];
    /*type pro */

    today: Date = new Date()
    startDate: Date = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1)

    endDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), 0)

    constructor(public getSrv: GetService) { }

    ngOnInit() {
        this.graphZonSub = this.getSrv.graphZonSubject.subscribe(
            (result: any) => {
                this.graphZon = result
                this.loadGraph(1, this.graphZon)
                console.log(result)
            }
        )
        this.graphTypeCouSub = this.getSrv.graphTypeCouSubject.subscribe(
            (result: any) => {
                this.graphTypeCou = result
                this.loadGraph(2, this.graphTypeCou)
            }
        )
        this.graphTypeProSub = this.getSrv.graphTypeProSubject.subscribe(
            (result: any) => {
                this.graphTypePro = result
                this.loadGraph(3, this.graphTypePro)
            }
        )

        this.getDataGraph()
    }

    getDataGraph() {
        this.updateLineGraph();
        this.getSrv.getGraphZon(this.startDate, this.endDate)
        this.getSrv.getGraphTypeCou(this.startDate, this.endDate, 10)
        this.getSrv.getGraphTypePro(this.startDate, this.endDate, 10)
    }

    loadGraph(index: number, data: any) {
        switch (index) {
            case 1:
                this.zoneData = []
                this.zoneLabel = []
                data.forEach(item => {
                    this.zoneData.push(item.total)
                    this.zoneLabel.push(item.nomZon)
                })
                break

            case 2:
                const lineData2 = []
                const lineLabel2 = []
                const bgColors = []
                const used = []
                data.forEach(item => {
                    lineData2.push(item.total)
                    lineLabel2.push(item.typeCou)
                    let index = Math.floor(Math.random() * (this.colors.length - 1))
                    if (used.includes(index))
                        index = Math.floor(Math.random() * (this.colors.length - 1))
                    used.push(index)
                    bgColors.push(this.colors[index].backgroundColor)
                })
                this.typeCoursierChartLabels = lineLabel2
                this.typeCoursierChartData = [lineData2]
                this.typeCoursierColors[0]["backgroundColor"] = bgColors

                break
            case 3:
                this.typeProduitData = []
                this.typeProduitLabel = []
                this.typeProduitChartColors = []
                const colors: any[] = []
                const used2 = []
                data.forEach(item => {
                    this.typeProduitData.push(item.total)
                    this.typeProduitLabel.push(item.typePro)
                    let index = Math.floor(Math.random() * (this.colors.length - 1))
                    if (used2.includes(index))
                        index = Math.floor(Math.random() * (this.colors.length - 1))
                    used2.push(index)
                    colors.push(this.colors[index].backgroundColor)
                })
                this.typeProduitChartColors = [{
                    backgroundColor: [
                        ...colors
                    ]
                }]
        }
        this.updateLineGraph()
    }

    updateLineGraph() {
        this.zoneChartData[0] = Object.assign({}, this.zoneChartData[0], { data: this.zoneData });
        this.zoneChartLabels = [];
        this.zoneChartLabels = this.zoneLabel;

        this.typeProduitChartData[0] = Object.assign({}, this.typeProduitChartData[0], { data: this.typeProduitData });
        this.typeProduitChartLabels = [];
        this.typeProduitChartLabels = this.typeProduitLabel;
    }

    changeDateGraph() {
        const dateStart = this.startDate;
        const dateEnd = this.endDate;
        this.getSrv.getGraphTypeCou(dateStart, dateEnd, 10)
        this.getSrv.getGraphTypePro(dateStart, dateEnd, 10)
        this.getSrv.getGraphZon(dateStart, dateEnd)
    }

}
