import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProfileclientService {

    endpoint: string = environment.API_ENDPOINT

    headers = new HttpHeaders().set('Content-Type', 'application/json');
    constructor(private http: HttpClient) { }



    // User profile
    getUserProfile(): Observable<any> {
        let api = `${this.endpoint}/profile`;
        return this.http.get(api, { headers: this.headers }).pipe(
            map((res: Response) => {
                return res || {}
            }),
            catchError(this.handleError)
        )
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
