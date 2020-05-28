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

    }
    async addPost(router: Router): Promise<void> {
        await this.postClient(router)
    }

    async postClient(router: Router) {
        router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
            let client = await this.clientRepository.findOneOrFail({where: {emailCli: req.body.username}})
            var bcrypt = require("bcrypt")
            bcrypt.compare(req.body.password, client.passCli, (err, isSame) => {
                if (!err && isSame) {
                    this.sendResponse(res, 200, {
                        token: jwt.sign({ client: client.emailCli }, process.env.CLIENT_PASS_PHRASE, { expiresIn: "30d" })
                    })
                } else {
                    this.sendResponse(res, 401, {
                        message: "Invalid credentials"
                    })
                }
            })

        })
    }
    async addPut(router: Router): Promise<void> {

    }

    async addDelete(router: Router): Promise<void> {

    }
}