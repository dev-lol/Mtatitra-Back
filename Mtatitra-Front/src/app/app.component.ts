import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Mtatitra';
    constructor(private router: Router) {
    }

    acceuilList = ['acceuil']
    get isAcceuil() {
        let test = false
        for (const str of this.acceuilList) {
            if (this.router.url.includes(str)) {
                test = true
                break
            }
        }
        return test
    }
}
