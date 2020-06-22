import express from 'express';
import bodyParser from "body-parser"
import compression from "compression"
import router from './routerApi';
import { createConnection } from 'typeorm';
import { ormconfig } from '../config';
import { createServer } from 'http';
import { Client } from '../entities/Client';
import jwt from 'jsonwebtoken';
export class CustomServer {
    app = express()
    static io
    constructor() {
        createConnection(ormconfig)
            .then(async _ => {
                var cors = require("cors")
                this.app.use(cors())
                this.app.use(bodyParser.urlencoded({ extended: true }))
                this.app.use(bodyParser.json())
                this.app.use("/api", compression())
                this.app.use("/api", router)
                const http = createServer(this.app)
                http.listen(process.env.PORT || 3000)
                console.log("Mtatitra is ONLINE ")
                CustomServer.io = require('socket.io')(http);
                CustomServer.io.on('connection', (socket) => {
                    socket.on("ajout room", (token) => {
                        jwt.verify(token, process.env.CLIENT_PASS_PHRASE, (error, payload) => {
                            if (error != null) {
                                return
                            } else {
                                socket.join(payload.id)
                                return
                            }
                        })
                    })
                });
            })
    }
}