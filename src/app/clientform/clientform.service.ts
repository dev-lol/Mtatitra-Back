import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClientformService {

    endpoint = environment.API_ENDPOINT
    constructor(
        private http: HttpClient
    ) {
    }

    getTarif(idTypeCoursier, idZonZone) {
        return this.http.get(`${this.endpoint}/tarif/typecoursier/${idTypeCoursier}/zone/${idZonZone}`).pipe(catchError(this.handleError))
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
