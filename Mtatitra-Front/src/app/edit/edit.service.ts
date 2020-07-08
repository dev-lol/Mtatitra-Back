import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EditService {
    endpoint: string = environment.API_ENDPOINT;
    headers = new HttpHeaders().set('Content-Type', 'application/json');
    currentUser = {};
    private email: string = ""

    error: Subject<String> = new Subject()

    constructor(
        private http: HttpClient,
        public router: Router
    ) { }

    /**
     * edit
     */
    public edit(edit: any) {
        let api = `${this.endpoint}/profile`;
        return this.http.put(api, edit)
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
