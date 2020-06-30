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
    getTarif() {
        return this.http.get(`${this.endpoint}/tarif`).pipe(
            map((res: Response) => {
                return res || {}
            }),
            catchError(this.handleError))
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
