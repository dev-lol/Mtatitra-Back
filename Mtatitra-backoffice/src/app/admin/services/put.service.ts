import { GetService } from './get.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class PutService {
    endpoint = environment.API_ENDPOINT

    constructor(public http: HttpClient, public getSrv: GetService) { }

    editTypeCoursier(idType: number, type: Object) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.put(`${this.endpoint}/typecoursier/${idType}`, type, headers).subscribe(
            (data: any) => {
                console.log(data);
                this.getSrv.getAllTypeCoursier();
            }, (error) => {
                console.log(error);
            });
    }

    editEtape(etapes: Object) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.put(`${this.endpoint}/etats`, etapes, headers).subscribe(
            (data: any) => {
                console.log(data);
                this.getSrv.getEtapes();
            }, (error) => {
                console.log(error);
            });
    }


    editTypeProduit(idType: number, type: Object) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.put(`${this.endpoint}/typeproduit/${idType}`, type, headers).subscribe(
            (data: any) => {
                console.log(data);
                this.getSrv.getAllTypeProduit();
            }, (error) => {
                console.log(error);
            });
    }

    editZone(idZone: number, zone: Object) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        delete zone["idZon"]
        this.http.put(`${this.endpoint}/zone/${idZone}`, zone, headers).subscribe(
            (data: any) => {
                console.log(data);
                this.getSrv.getZone();
            }, (error) => {
                console.log(error);
            });
    }

    editResultat(idRes: number, res: Object) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        delete res["idRes"]
        this.http.put(`${this.endpoint}/resultat/${idRes}`, res, headers).subscribe(
            (data: any) => {
                console.log(data);
                this.getSrv.getResultat();
            }, (error) => {
                console.log(error);
            });
    }

    editLieu(idLieu: number, lieu: Object) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        delete lieu["idLie"]
        this.http.put(`${this.endpoint}/lieu/${idLieu}`, lieu, headers).subscribe(
            (data: any) => {
                console.log(data);
                this.getSrv.getZone();
            }, (error) => {
                console.log(error);
            });
    }

    editCoursier(idCoursier: number, coursier: Object) {
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.put(`${this.endpoint}/coursier/${idCoursier}`, coursier, headers).subscribe(
            (data: any) => {
                console.log(data);
                this.getSrv.getCoursiers();
            }, (error) => {
                console.log(error);
            });
    }

    assigneCoursierLivraison(idLivraison, idCoursier) {
        // tslint:disable-next-line: object-literal-key-quotes
        const assigne = {
            idLiv: idLivraison,
            idCouCoursier: idCoursier
        };
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.patch(`${this.endpoint}/livraison/${idLivraison}/coursier/${idCoursier}`, headers).subscribe(
            (data: any) => {
                console.log(data);
                this.getSrv.getAllLivraison();  // changer
            }, (error) => {
                console.log(error);
            });
    }

    editTarif(idTar: number, tarif: object) {
        console.log(tarif);
        // tslint:disable-next-line: object-literal-key-quotes
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.put(`${this.endpoint}/tarifs/${idTar}`, tarif, headers).subscribe(
            (data: any) => {
                console.log(data);
                this.getSrv.getTarif();
            }, (error) => {
                console.log(error);
            });
    }
    editLimitDate(id: number, limitDate: object) {
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.put(`${this.endpoint}/datelimite/${id}`, limitDate, headers).subscribe(
            (data: any) => {
                this.getSrv.getLimitDate()
            }, (error) => console.log(error)
        )
    }
}
