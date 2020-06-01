import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Client } from "../../../entities/Client"
import { Repository, Connection, createConnection } from "typeorm";
import { ormconfig } from "../../../config";
import jwt from 'jsonwebtoken';
import { checkId } from "../../security/SecurityClient";
export default class ClientController extends Controller {
    clientRepository: Repository<Client>
    constructor() {
        super()
        this.createConnectionAndAssignRepository()
            .then(async (_) => {
                await this.addAllRoutes(this.mainRouter)
            })
    }


    async createConnectionAndAssignRepository(): Promise<any> {
        let connection: Connection = await createConnection(ormconfig)
        this.clientRepository = connection.getRepository(Client)
    }
    async addGet(router: Router): Promise<void> {
        router.get("user-profile/:idCli", async (req: Request, res: Response, next: NextFunction) => {
            try {
                checkId(req, res, next, req.params.idCli)
                this.sendResponse(res, 200, { data: this.clientRepository.findOneOrFail(req.params.idCli) })
            } catch (error) {
                this.sendResponse(res, 404, {message: "not found"})
            }
        })
    }
    async addPost(router: Router): Promise<void> {
        await this.postClient(router)
    }

    async postClient(router: Router) {
        router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let client = await this.clientRepository.findOneOrFail({ where: { emailCli: req.body.username } })
                if (client.confirmationCli) {
                    return this.sendResponse(res, 401, { message: "Compte non confirmee" })
                }
                var bcrypt = require("bcrypt")
                bcrypt.compare(req.body.password, client.passCli, (err, isSame) => {
                    if (!err && isSame) {
                        this.sendResponse(res, 200, {
                            token: jwt.sign({ client: client.emailCli, id: client.idCli }, process.env.CLIENT_PASS_PHRASE, { expiresIn: "30d" })
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

    }

    async addDelete(router: Router): Promise<void> {

    }
}