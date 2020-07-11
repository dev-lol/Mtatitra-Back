import { GetService } from './get.service';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { finalize, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    endpoint = environment.API_ENDPOINT

    constructor(private http: HttpClient, private getSrv: GetService) { }

    addTarif(value: object) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.endpoint}/tarifs`, value, headers)
    }

    addLimitDat(value: string) {
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        let data = {
            limiteDat: value
        }
        this.http.post(`${this.endpoint}/datelimite`, data, headers).subscribe(
            (data: any) => {
                this.getSrv.getLimitDate()
            }, (error) => console.log(error)
        )
    }

    addTypeCoursier(data: any) {
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.endpoint}/typecoursier`, data, headers)
    }
    addTypeProduit(str: string) {
        // tslint:disable-next-line: object-literal-key-quotes
        const options: any = { 'typePro': str };
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.post(`${this.endpoint}/typeproduit`, options, headers).subscribe(
            (data: any) => {
                console.log(data);
                // Get service
                this.getSrv.getAllTypeProduit();

            }, (error) => {
                console.log(error);
            });
    }

    addZone(data: string) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.endpoint}/zone`, data, headers)
    }

    addResultat(data: any) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.endpoint}/resultat`, data, headers)
    }

    addLieu(data: string) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.endpoint}/lieu`, data, headers)
    }

    addCoursier(model: object) {
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.endpoint}/coursier`, model, headers)
    }


    postRapport(idLiv: number, data: Object) {
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.endpoint}/livraison/${idLiv}/rapport`, data, headers)
    }
}
