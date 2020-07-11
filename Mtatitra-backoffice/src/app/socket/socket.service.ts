import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { GetService } from '../admin/services/get.service';
import { LoginService } from '../admin/login-admin/login.service';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    socket;

    constructor(private getSrv: GetService, private loginService: LoginService) { }


    setupSocketConnection() {
        if (this.socket || !this.loginService.isLoggedIn) return;
        this.socket = io(environment.SOCKET_ENDPOINT, { query: { token: localStorage.getItem('token') } });
        this.socket.on('reconnect_attempt', () => {
            this.socket.io.opts.query = {
                token: localStorage.getItem('token')
            }
        });
        this.socket.on("plan", (data) => {
            try {
                const pathNames = ['/planning', '/livraison']
                const tmp = new Date(data)
                const date = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate())
                const tmp2 = new Date(this.getSrv.lastDate)
                const dateComp = new Date(tmp2.getFullYear(), tmp2.getMonth(), tmp2.getDate())
                console.log("HERE")
                if (date.getTime() == dateComp.getTime() && pathNames.includes(location.pathname)) {
                    console.log("TAFA")
                    if (location.pathname == pathNames[0]) {
                        console.log("PLAN")
                        this.getSrv.getTypeCouriserPlanning()
                        this.getSrv.getTypeCoursierSansPlanning()
                    } else if (location.pathname == pathNames[1]) {
                        console.log("LIV")
                        this.getSrv.getAllLivraison()
                    }
                }
            } catch (error) {
                console.log(error)
            }
        })
        this.socket.on('connect', (socket) => {

        })
    }
}
