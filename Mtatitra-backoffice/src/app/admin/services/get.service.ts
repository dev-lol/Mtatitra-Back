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
  constructor(public http: HttpClient) { }

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
        this.http.get(`${this.endpoint}/zone`).subscribe(
            (result) => {
                this.zoneSubject.next(result);
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
    getAllLivraison(what: string = this.lastWhat, date: string = this.lastDate) {
        this.lastDate = date
        this.lastWhat = what
        let url = `coursier=${what}&date=${date}`;

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

  getLimitDate(){
    this.http.get(`${this.endpoint}/datelimite`).subscribe(
      (result : any)=>{
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

  getGraphTopLivraison(dateStart : any, dateEnd : any, top: number) {
    this.http.get(`${this.endpoint}/client/stat?start=${dateStart}&end=${dateEnd}&limit=${top}`).subscribe(
      (res) => {
        // console.log('list msg with interlocutor ' + response);
        let result: any;
        result = res;
        this.graphClientSubject.next(result.slice());
      }
    );
  }


}
