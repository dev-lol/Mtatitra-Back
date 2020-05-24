import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";

import { Controller } from "../../Controller";
import { Connection, TableInheritance } from 'typeorm';
import { createConnection } from 'typeorm';
import { ormconfig } from '../../../config';
import { Repository } from 'typeorm';
import { Client } from '../../../entities/Client';
import Utils from '../../../utils/SendEmail';

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
        this.getConfirmation(router)
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
                var count = await this.clientRepository.count({ where: { emailCli: req.body.emailCli } })
                if (count > 0) {
                    throw new Error("Email deja utilisé")
                }
                var client: Client = this.clientRepository.create(req.body as Object)
                //TODO: use JWT
                client.passCli = client.passCli
                client.confirmationCli = Math.floor((Math.random() * (999999 - 100000)) + 100000).toString()
                await this.clientRepository.save(client).then(_ => {
                    Utils.sendEmail(client.emailCli, client.confirmationCli)
                })
                this.sendResponse(res, 200, { message: "Veuillez confirmer votre compte via email" })
            } catch (error) {
                this.sendResponse(res, 400, { message: error })
            }
        })
    }

    /**
     *
     *
     * @param {Router} router
     * @memberof SignupController
     */
    async getConfirmation(router: Router) {
        router.get("/confirmations/:emailCli/:code", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var client: Client = await this.clientRepository.findOneOrFail({ where: { emailCli: req.params.emailCli } })
                if (client.confirmationCli == req.params.code){
                    client.confirmationCli = ""
                }
                await this.clientRepository.save(client)
                this.sendResponse(res, 200, { message: "Confirmation succes" })
            } catch (error) {
                this.sendResponse(res, 400, { message: error })
            }
        })
    }

    async addDelete(router: Router): Promise<void> { }

    async addPut(router: Router): Promise<void> { }
}