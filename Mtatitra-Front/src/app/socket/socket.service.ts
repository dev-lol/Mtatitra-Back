import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    socket;

    constructor() { }
    setupSocketConnection() {
        this.socket = io(environment.SOCKET_ENDPOINT);
        this.socket.emit('ajout room', localStorage.getItem('access_token'))
        this.socket.on('etats', (data) => {
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
    }
    private openNotification(liv) {
        var img = '/assets/images/rounded.png';
        var text = `Livraison numero ${liv.idLiv}\nEtat: ${liv.idEtaEtats.etatEta}`;
        var notification = new Notification('MTATITRA', { body: text, icon: img });
        notification.onclick = (event: any) => {
            console.log("clicked")
        }
    }
}
