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
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var data = await this.clientRepository.find()
                this.sendResponse(res, 200, data)
            } catch (error) {
                this.sendResponse(res, 404, {message: "not found"})
            }
        })
    }
    async addPost(router: Router): Promise<void> {
        await this.postClient(router)
    }

    async postClient(router: Router) {

    }
    async addPut(router: Router): Promise<void> {

    }

    async addDelete(router: Router): Promise<void> {

    }
}