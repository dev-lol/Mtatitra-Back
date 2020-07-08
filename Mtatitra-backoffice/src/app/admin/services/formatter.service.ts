import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FormatterService {

    constructor() { }

    numTel(raw: any) {
        raw = raw.toString()
        return "+ 261 " + raw.substring(0, 2) + " " + raw.substring(2, 4) + " " + raw.substring(4, 7) + " " + raw.substring(7)
    }
}
