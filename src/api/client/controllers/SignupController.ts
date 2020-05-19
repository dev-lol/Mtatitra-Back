import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";

import { Controller } from "../../Controller";
import { Connection, TableInheritance } from 'typeorm';
import { createConnection } from 'typeorm';
import { ormconfig } from '../../../config';
import { Repository } from 'typeorm';
import { Client } from '../../../entities/Client';

export default class SignupController extends Controller {

    clientRepository: Repository<Client>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.clientRepository = connection.getRepository(Client)
        } catch (error) {
            console.log(error)
        }

    }

    async addGet(router: Router): Promise<void> {
    }


    async addPost(router: Router): Promise<void> {
        await this.postSignup(router)
    }
    /**
     *
     *
     * @param {Router} router
     * @memberof SignupController
     * 
     * form data = [emailCli, passCli]
     * 
     */
    async postSignup(router: Router) {
        router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var client: Client = this.clientRepository.create(req.body as Object)
                //TODO: use JWT
                client.passCli = client.passCli
                client.confirmationCli = Math.floor((Math.random() * (999999 - 100000)) + 100000).toString()
                //TODO: Send Email
                this.sendResponse(res,200,{message: "Veuillez confirmer votre compte via email"})
            } catch (error) {
                this.sendResponse(res,400, {message: error})
            }
        })
    }

    async addDelete(router: Router): Promise<void> { }

    async addPut(router: Router): Promise<void> { }
}