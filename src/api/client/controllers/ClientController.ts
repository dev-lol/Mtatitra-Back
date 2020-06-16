import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Client } from "../../../entities/Client"
import { Repository, Connection, createConnection } from "typeorm";
import { ormconfig } from "../../../config";
import jwt from 'jsonwebtoken';
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
        router.get("/profile", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let idCli
                var jwtToken: string = req.headers["authorization"]
                jwt.decode(jwtToken.split(" ")[1], (error, payload) => {
                    if (error)
                        throw error;
                    else {
                        idCli = payload.id
                    }
                })
                var data = await this.clientRepository.findOneOrFail(idCli)
                delete(data["passCli"])
                delete(data["resetCodeCli"])
                delete(data["confirmationCli"])
                this.sendResponse(res, 200, { data: data})
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
                            token: jwt.sign({ username: client.emailCli, id: client.idCli }, process.env.CLIENT_PASS_PHRASE, { expiresIn: "30d" })
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