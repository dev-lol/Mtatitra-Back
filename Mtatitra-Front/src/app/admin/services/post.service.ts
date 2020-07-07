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

    addTypeCoursier(str: string) {
        console.log(str)
        // tslint:disable-next-line: object-literal-key-quotes
        const options: any = { 'typeCou': str };
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.post(`${this.endpoint}/typecoursier`, options, headers).subscribe(
            (data: any) => {
                console.log(data);
                // Get service
                this.getSrv.getAllTypeCoursier();

            }, (error) => {
                console.log(error);
            });
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

    addLieu(data: string) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.endpoint}/lieu`, data, headers)
    }

    addCoursier(model: object) {
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.endpoint}/coursier`, model, headers)
    }

    addLivraison(livraison: object) {
        console.log(livraison);
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.post(`/`, livraison, headers).subscribe(
            (data: any) => {
                console.log(data);
            }, (error) => {
                console.log(error);
            });
    }


}
