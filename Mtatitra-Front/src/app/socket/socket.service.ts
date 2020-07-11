import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    socket;

    constructor(private loginService: LoginService, private router: Router) {
    }
    setupSocketConnection() {
        if (this.socket || !this.loginService.isLoggedIn) return;
        this.socket = io(environment.SOCKET_ENDPOINT, { query: { token: localStorage.getItem('access_token') } });
        this.socket.on('reconnect_attempt', () => {
            this.socket.io.opts.query = {
                token: localStorage.getItem('access_token')
            }
        });
        this.socket.on('etats', (data) => {
            console.log(data)
            if (Notification.permission !== "granted") {
                Notification.requestPermission().then((permission: NotificationPermission) => {
                    if (permission === "granted") {
                        this.openNotification(data)
                    }
                });
            } else {
                this.openNotification(data)
            }
        });
        this.socket.on("resultats", (data) => {
            console.log(data)
            if (Notification.permission !== "granted") {
                Notification.requestPermission().then((permission: NotificationPermission) => {
                    if (permission === "granted") {
                        this.openNotificationResultats(data)
                    }
                });
            } else {
                this.openNotificationResultats(data)
            }
        })
    }
    private openNotification(liv) {
        var img = '/assets/images/rounded.png';
        var text = `Livraison numero ${liv.idLiv}\nEtat: ${liv.idEtaEtats.etatEta}`;
        var notification = new Notification('MTATITRA', { body: text, icon: img });
        notification.onclick = (event: any) => {
            this.router.navigate(['profile'], { queryParams: { tab: 1, subtab: 1 } })
        }
    }
    private openNotificationResultats(liv) {
        var img = '/assets/images/rounded.png';
        var text = `Livraison numero ${liv.idLiv}\nResultats: ${liv.idResResultat.resultatRes}`;
        var notification = new Notification('MTATITRA', { body: text, icon: img });
        notification.onclick = (event: any) => {
            this.router.navigate(['profile'], { queryParams: { tab: 1, subtab: 2 } })
        }
    }
}
