import express from 'express';
import bodyParser from "body-parser"
import compression from "compression"
import router from './routerApi';
import { createConnection } from 'typeorm';
import { ormconfig } from '../config';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import { join } from 'path';

export class CustomServer {
    app = express()
    static ioAdmin
    static ioClient
    static ioCoursier
    constructor() {
        const path = require('path')
        createConnection(ormconfig)
            .then(async _ => {
                var cors = require("cors")
                this.app.use(cors())
                this.app.use(bodyParser.urlencoded({ extended: true }))
                this.app.use(bodyParser.json())
                this.app.use("/api", compression())
                this.app.use("/api", router)
                this.app.use("/public", express.static(join(__dirname, "../../public")))
                const client = express()
                const admin = express()
                admin.use('/', express.static(path.join(__dirname, '../../Mtatitra-backoffice/dist/Mtatitra')))
                admin.get('*', (req, res, next) => {
                    res.sendFile(path.join(__dirname, '../../Mtatitra-backoffice/dist/Mtatitra/index.html'))
                })
                client.use('/', express.static(path.join(__dirname, '../../Mtatitra-Front/dist/Mtatitra')))
                client.get('*', (req, res, next) => {
                    res.sendFile(path.join(__dirname, '../../Mtatitra-Front/dist/Mtatitra/index.html'))
                })
                this.app.use("/admin", admin)
                this.app.use("/", client)
                const http = createServer(this.app)
                http.listen(process.env.PORT || 3000)
                console.log(`Mtatitra is ONLINE at ${process.pid} `)
                const io = require('socket.io')(http);
                CustomServer.ioAdmin = io.of("/admin")
                CustomServer.ioClient = io.of("/client")
                CustomServer.ioCoursier = io.of("/coursier")
                CustomServer.ioAdmin.use((socket, next) => {
                    const token = socket.handshake.query.token
                    jwt.verify(token, process.env.ADMIN_PASS_PHRASE, (error, payload) => {
                        if (error != null) {
                            return next(new Error('unauthorized'))
                        } else {
                            return next()
                        }
                    })
                })

                CustomServer.ioClient.use((socket, next) => {
                    const token = socket.handshake.query.token
                    jwt.verify(token, process.env.CLIENT_PASS_PHRASE, (error, payload) => {
                        if (error != null) {
                            return next(new Error('unauthorized'))
                        } else {
                            socket.join(payload.id)
                            return next()
                        }
                    })
                })

                CustomServer.ioCoursier.use((socket, next) => {
                    const token = socket.handshake.query.token
                    jwt.verify(token, process.env.COURSIER_PASS_PHRASE, (error, payload) => {
                        if (error != null) {
                            return next(new Error('unauthorized'))
                        } else {
                            socket.join(payload.id)
                            return next()
                        }
                    })
                })
            })
    }
}