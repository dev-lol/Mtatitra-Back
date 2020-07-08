import { Component, OnInit } from '@angular/core';
import { GetService } from '../services/get.service';
import { Subscription } from 'rxjs';
import { TypeCoursier } from '../type/type.component';
import { FormatterService } from '../services/formatter.service';


@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {


    today: Date = new Date()
    startDate: Date = new Date(this.today)
    datas: any[]

    dataSub: Subscription
    typeCouSub: Subscription
    constructor(public getSrv: GetService, public formatter: FormatterService) { }

    ngOnInit() {

        this.initPlanning()
        this.getPlans()
    }



    initPlanning() {

        this.dataSub = this.getSrv.planningSubject.subscribe(
            (res: any[]) => {
                this.datas = res
                console.log(res)
            }
        )
    }

    getPlans() {
        this.getSrv.getTypeCouriserPlanning
            (this.startDate.toISOString())
    }

    changeDateGraph() {
        this.getSrv.getTypeCouriserPlanning(this.startDate.toISOString())
    }

}
