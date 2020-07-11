import { GetService } from './get.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DeleteService {
    endpoint: string = environment.API_ENDPOINT
    constructor(private http: HttpClient, private getSrv: GetService) { }


    deleteTarif(id: number) {
        // tslint:disable-next-line: object-literal-key-quotes
        this.http.delete(`${this.endpoint}/tarifs/${id}`).subscribe(
            (data: any) => {
                console.log(data);
                // Get service
                this.getSrv.getTarif();
            }, (error) => {
                console.log(error);
            });
    }


    deleteTypeCoursier(id: number) {
        // tslint:disable-next-line: object-literal-key-quotes
        this.http.delete(`${this.endpoint}/typecoursier/${id}`).subscribe(
            (data: any) => {
                console.log(data);
                // Get service
                this.getSrv.getAllTypeCoursier();

            }, (error) => {
                console.log(error);
            });
    }

    deleteTypeProduit(id: number) {
        // tslint:disable-next-line: object-literal-key-quotes
        this.http.delete(`${this.endpoint}/typeproduit/${id}`).subscribe(
            (data: any) => {
                console.log(data);
                // Get service
                this.getSrv.getAllTypeProduit();

            }, (error) => {
                console.log(error);
            });
    }

    deleteZone(id: number) {
        // tslint:disable-next-line: object-literal-key-quotes
        this.http.delete(`${this.endpoint}/zone/${id}`).subscribe(
            (data: any) => {
                console.log(data);
                // Get service
                this.getSrv.getZone();

            }, (error) => {
                console.log(error);
            });
    }

    deleteResultat(id: number) {
        // tslint:disable-next-line: object-literal-key-quotes
        this.http.delete(`${this.endpoint}/resultat/${id}`).subscribe(
            (data: any) => {
                console.log(data);
                this.getSrv.getResultat();

            }, (error) => {
                console.log(error);
            });
    }

    deleteLieu(id: number) {
        // tslint:disable-next-line: object-literal-key-quotes
        this.http.delete(`${this.endpoint}/lieu/${id}`).subscribe(
            (data: any) => {
                console.log(data);
                // Get service
                this.getSrv.getZone();

            }, (error) => {
                console.log(error);
            });
    }


    deleteLimiteDat(id: number) {
        this.http.delete(`${this.endpoint}/datelimite/${id}`).subscribe(
            (data: any) => {
                this.getSrv.getLimitDate()
            }, (error) => console.log(error)

        )
    }

    deleteCoursier(id: number) {
        // tslint:disable-next-line: object-literal-key-quotes
        this.http.delete(`${this.endpoint}/coursier/${id}`).subscribe(
            (data: any) => {
                console.log(data);
                // Get service
                this.getSrv.getCoursiers();
            }, (error) => {
                console.log(error);
            });
    }

}
