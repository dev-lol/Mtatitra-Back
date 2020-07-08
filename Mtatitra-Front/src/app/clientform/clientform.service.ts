import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClientformService {

     // Local variable which stores 
    public poids = [];

    endpoint = environment.API_ENDPOINT
    constructor(
        private http: HttpClient
    ) {
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

    // Calculate total price on item added to the cart
  getTotalPrice() {
    let total = 0;

    this.poids.map(item => {
      total += item.price;
    });

    return total
  }
}
