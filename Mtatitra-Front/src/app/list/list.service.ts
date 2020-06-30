import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Livraison } from './list.component';

@Injectable({
    providedIn: 'root'
})
export class ListService {

    endpoint: string = environment.API_ENDPOINT
    constructor(private http: HttpClient) { }
    getLivraison() {
        return this.http.get(`${this.endpoint}/livraison`).pipe(catchError(this.handleError))
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
