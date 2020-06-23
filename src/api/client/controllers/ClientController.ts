import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Client } from "../../../entities/Client"
import { getRepository, Connection, createConnection, getConnection } from "typeorm";
import jwt from 'jsonwebtoken';
import Password from '../../../utils/Password';
export default class ClientController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }

    async addGet(router: Router): Promise<void> {
        router.get("/profile", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let idCli = res.locals.id
                var data = await getRepository(Client).findOneOrFail(idCli)
                delete (data["passCli"])
                delete (data["resetCodeCli"])
                delete (data["confirmationCli"])
                this.sendResponse(res, 200, { data: data })
            } catch (error) {
                this.sendResponse(res, 404, { message: "not found" })
            }
        })
    }
    async addPost(router: Router): Promise<void> {
        await this.postClient(router)
    }

    async postClient(router: Router) {
        router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let client = await getRepository(Client).findOneOrFail({ where: { emailCli: req.body.username } })
                if (client.confirmationCli) {
                    return this.sendResponse(res, 401, { message: "Compte non confirmee" })
                }
                var bcrypt = require("bcrypt")
                bcrypt.compare(req.body.password, client.passCli, (err, isSame) => {
                    if (!err && isSame) {
                        this.sendResponse(res, 200, {
                            token: jwt.sign({ username: client.emailCli, id: client.idCli }, process.env.CLIENT_PASS_PHRASE, { expiresIn: "30s" })
                        })
                    } else {
                        this.sendResponse(res, 401, {
                            message: "Invalid credentials"
                        })
                    }
                })

            } catch (error) {
                this.sendResponse(res, 401, {
                    message: "Invalid credentials"
                })
            }
        })
    }
    async addPut(router: Router): Promise<void> {
        router.put("/profile", async (req: Request, res: Response, next: NextFunction) => {
            try {


                var clientToModify: Client = await getRepository(Client).findOneOrFail(res.locals.id)
                var clientFromRequest: Client = getRepository(Client).create(req.body as Object)
                delete clientFromRequest["passCli"]
                clientToModify = { ...clientToModify, ...clientFromRequest }
                if (req.body.oldPassword) {
                    const isSame = await Password.compare(req.body.oldPassword, clientToModify.passCli)
                    if (isSame) {
                        clientToModify.passCli = await Password.hash(req.body.newPassword)
                    }
                }
                await getRepository(Client).save(clientToModify)
                this.sendResponse(res, 200, { message: "Profile updated" })
            } catch (error) {
                this.sendResponse(res, 400, {
                    message: "Bad request"
                })
            }
        })

    }

    async addDelete(router: Router): Promise<void> {

    }
}