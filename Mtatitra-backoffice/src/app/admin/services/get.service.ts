import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class GetService {
    endpoint = environment.API_ENDPOINT
    typeCoursierSubject = new Subject<any>();
    typeProduitSubject = new Subject<any>();
    typeLivraisonSubject = new Subject<any>();
    zoneSubject = new Subject<any>();
    clientSubject = new Subject<any>();
    coursierSubject = new Subject<any>();
    livNocoursierSubject = new Subject<any>();
    livAveccoursierSubject = new Subject<any>();
    livSubject = new Subject<any>();
    graphSubject = new Subject<any>();
    tarifSubject = new Subject<any>();
    dateLimitSubject = new Subject<any>();
    graphClientSubject = new Subject<any>();
    graphZonSubject = new Subject<any>();
    graphTypeCouSubject = new Subject<any>();
    graphTypeProSubject = new Subject<any>();
    graphCoursierSubject = new Subject<any>();

    planningSubject = new Subject<any>();
    etapesSubject = new Subject<any>();
    resultatSubject = new Subject<any>();

    sansPlanningSubject = new Subject<any>();


    constructor(public http: HttpClient) { }

    getEtapes() {
        this.http.get(`${this.endpoint}/etats`).subscribe(
            (result: any) => {
                this.etapesSubject.next(result.slice())
            }
        )
    }
    getTypeCouriserPlanning(date: string = this.lastDate) {
        this.lastDate = date
        this.http.get(`${this.endpoint}/typecoursier/planning?date=${date}&coursier=true`).subscribe(
            (result: any) => {
                let plan: any[]
                plan = result
                this.planningSubject.next(plan.slice())
            })
    }

    getTypeCoursierSansPlanning(date: string = this.lastDate) {
        this.lastDate = date
        this.http.get(`${this.endpoint}/typecoursier/planning?date=${date}&coursier=false`).subscribe(
            (result: any) => {
                let plan: any[]
                plan = result
                this.sansPlanningSubject.next(plan.slice())
            }
        )
    }

    getAllType() {
        this.getAllTypeCoursier();
        this.getAllTypeProduit();

    }

    getAllTypeCoursier() {
        this.http.get(`${this.endpoint}/typecoursier`).subscribe(
            (result: any) => {
                // console.log('list msg with interlocutor ' + response);
                let type: any = [];
                type = result.data;
                this.typeCoursierSubject.next(type.slice());
            }
        );
    }

    getAllTypeProduit() {
        this.http.get(`${this.endpoint}/typeproduit`).subscribe(
            (result: any) => {
                // console.log('list msg with interlocutor ' + response);
                let type: any = [];
                type = result.data;
                this.typeProduitSubject.next(type.slice());
            }
        );
    }
    getCoursiers() {
        this.http.get(`${this.endpoint}/coursier`).subscribe(
            (result: any) => {
                this.coursierSubject.next(result);
            }
        );
    }

    getZone() {
        this.http.get(`${this.endpoint}/lieu`).subscribe(
            (result) => {
                this.zoneSubject.next(result);
            }
        );
    }
    getResultat() {
        this.http.get(`${this.endpoint}/resultat`).subscribe(
            (result) => {
                this.resultatSubject.next(result);
            }
        );
    }

    getClient() {
        this.http.get(`${this.endpoint}/client`).subscribe(
            (result: any) => {
                this.clientSubject.next(result);
            }
        );
    }



    lastWhat = 'all'
    lastDate = new Date().toDateString()
    getAllLivraison(date: string = this.lastDate) {
        this.lastDate = date
        let url = `date=${date}`;

        this.http.get(`${this.endpoint}/livraison?${url}`).subscribe(
            (result) => {
                this.livSubject.next(result);
            }
        );
    }
    getTarif() {
        this.http.get(`${this.endpoint}/tarifs`).subscribe(
            (result) => {
                // console.log('list msg with interlocutor ' + response);
                let tarifs: any = [];
                tarifs = result;
                this.tarifSubject.next(tarifs.slice());
            }
        );
    }

    getLimitDate() {
        this.http.get(`${this.endpoint}/datelimite`).subscribe(
            (result: any) => {
                this.dateLimitSubject.next(result.slice())
            }
        )
    }


    getGraphByDate(dateStart: any, dateEnd: any) {
        this.http.get(`${this.endpoint}/livraison/stat?start=${dateStart}&end=${dateEnd}`).subscribe(
            (res) => {
                // console.log('list msg with interlocutor ' + response);
                let result: any;
                result = res;
                this.graphSubject.next(result.slice());
            }
        );
    }

    getGraphTopLivraison(dateStart: any, dateEnd: any, top: number) {
        this.http.get(`${this.endpoint}/client/stat?start=${dateStart}&end=${dateEnd}&limit=${top}`).subscribe(
            (res) => {
                // console.log('list msg with interlocutor ' + response);
                let result: any;
                result = res;
                this.graphClientSubject.next(result.slice());
            }
        );
    }

    getGraphZon(dateStart: any, dateEnd: any) {
        this.http.get(`${this.endpoint}/zone/stat?start=${dateStart}&end=${dateEnd}`).subscribe(
            (res) => {
                let result: any
                result = res
                this.graphZonSubject.next(result.slice())
            }
        )
    }

    getGraphTypeCou(dateStart: any, dateEnd: any, limit: number) {
        this.http.get(`${this.endpoint}/typecoursier/stat?start=${dateStart}&end=${dateEnd}&limit=${limit}`).subscribe(
            (res) => {
                let result: any
                result = res
                this.graphTypeCouSubject.next(result.slice())
            }
        )
    }
    getGraphTypePro(dateStart: any, dateEnd: any, limit: number) {
        this.http.get(`${this.endpoint}/typeproduit/stat?start=${dateStart}&end=${dateEnd}&limit=${limit}`).subscribe(
            (res) => {
                let result: any
                result = res
                this.graphTypeProSubject.next(result.slice())
            }
        )
    }

    getGraphCouriser(dateStart: any, dateEnd: any, limit: number) {
        this.http.get(`${this.endpoint}/coursier/stat?start=${dateStart}&end=${dateEnd}&limit=${limit}`).subscribe(
            (res) => {
                let result: any
                result = res
                this.graphCoursierSubject.next(result.slice())
            }
        )
    }


}
