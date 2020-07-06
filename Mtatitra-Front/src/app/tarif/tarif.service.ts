import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TarifService {

    endpoint = environment.API_ENDPOINT
    constructor(
        private http: HttpClient
    ) {

    }

    getTarif(idLieDepart, idLieDestination, idTypeCoursier = null) {
        if (idTypeCoursier)
            return this.http.get(`${this.endpoint}/tarif?typeCoursier=${idTypeCoursier}&lieuDepart=${idLieDepart}&lieuArrivee=${idLieDestination}`).pipe(catchError(this.handleError))
        else
            return this.http.get(`${this.endpoint}/tarif?lieuDepart=${idLieDepart}&lieuArrivee=${idLieDestination}`).pipe(catchError(this.handleError))
    }

    handleError(error: HttpErrorResponse) {
        let msg = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            msg = error.error.message;
        } else {
            // server-side error
            msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(msg);
    }
}

export interface Tarif {
    idTar: number;
    tarifTar: number;
    idTypeCouTypeCoursier: any;

}

export interface Lieu {
    idLie: number;
    nomLie: string;
}