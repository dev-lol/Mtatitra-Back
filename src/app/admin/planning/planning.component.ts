import { Component, OnInit, HostBinding } from '@angular/core';
import { GetService } from '../services/get.service';
import { Subscription } from 'rxjs';
import { TypeCoursier } from '../type/type.component';
import { FormatterService } from '../services/formatter.service';
import { PutService } from '../services/put.service';
import { Router } from '@angular/router';
import { FormBuilder, FormArray } from '@angular/forms';
import { SocketService } from 'src/app/socket/socket.service';



@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

    @HostBinding('@.disabled') public animationIsDisabled = false
    currentIdCoursier = 0;

    tmp = new Date();
    today = new Date(this.tmp.getFullYear(), this.tmp.getMonth(), this.tmp.getDate())
    dateValue: Date = this.today

    datas: any[] = []

    datasRaw: any[] = []
    datasSans: any[] = []


    dataSub: Subscription
    typeCouSub: Subscription
    dataSansSub: Subscription

    typeCoursier: TypeCoursier[] = []

    currentFiltre = "tout"


    constructor(private fb: FormBuilder, public getSrc: GetService, public putSrv: PutService, public router: Router, public formatter: FormatterService, socketSrv: SocketService) { }

    ngOnInit() {
        this.initPlanning()
        this.getPlans()
    }


    initPlanning() {
        let count = 0
        this.dataSub = this.getSrc.planningSubject.subscribe(
            (res: any[]) => {
                count++
                this.animationIsDisabled = true
                setTimeout(() => {
                    this.datas = res
                    this.datasRaw = res
                    count--
                    if (count == 0) this.animationIsDisabled = false
                }, 200)
            }
        )
        this.dataSansSub = this.getSrc.sansPlanningSubject.subscribe(
            (res: any[]) => {
                count++
                this.animationIsDisabled = true
                setTimeout(() => {
                    this.datasSans = res
                    count--
                    if (count == 0) this.animationIsDisabled = false
                }, 200)
            }
        )
    }

    assigne(idLiv: number) {
        this.putSrv.assigneCoursierLivraison(idLiv, this.currentIdCoursier);
        this.getPlans()
    }
    goToDetail() {
        this.router.navigate(["/livraison"])
    }

    getPlans() {
        this.animationIsDisabled = true
        this.getSrc.getTypeCouriserPlanning(this.dateValue.toISOString())
        this.getSrc.getTypeCoursierSansPlanning(this.dateValue.toISOString())
    }
    get isReadOnly() {
        return this.today > this.dateValue
    }

    get countSans() {
        let count = 0
        for (const type of this.datasSans as Array<any>) {
            count += type.livraisons.length
        }
        return count > 0 ? count : ""
    }

    filtre() {

        switch (this.currentFiltre) {
            case 'enCours':
                this.datas = []
                for (const type of this.datasRaw) {
                    const tmpLiv = type.livraisons.filter((v) => !v.idResResultat)
                    const tmp = { ...type }
                    tmp.livraisons = tmpLiv
                    if (tmpLiv.length > 0)
                        this.datas.push(tmp)
                }
                break;
            case 'termine':
                this.datas = []
                for (const type of this.datasRaw) {
                    const tmpLiv = type.livraisons.filter((v) => v.idResResultat)
                    const tmp = { ...type }
                    tmp.livraisons = tmpLiv
                    if (tmpLiv.length > 0)
                        this.datas.push(tmp)
                }
                break;
            case 'tout':
            default:
                this.datas = this.datasRaw
                break;
        }
    }
}
