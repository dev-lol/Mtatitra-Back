import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from './socket/socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Mtatitra';
    constructor(private router: Router, socket: SocketService) {
        socket.setupSocketConnection()
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
