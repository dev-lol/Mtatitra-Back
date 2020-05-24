import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";

import { Controller } from "../../Controller";
import { Connection } from 'typeorm';
import { createConnection } from 'typeorm';
import { ormconfig } from '../../../config';
import { Repository } from 'typeorm';
import { Client } from '../../../entities/Client';

export default class LoginController extends Controller {

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
        await this.postLogin(router)
    }
    /**
     *
     *
     * @param {Router} router
     * @memberof TestController
     * 
     * form data = [emailCli, passCli]
     * 
     * 203 quand le client n'a pas encore confirmer son compte
     * 
     */
    async postLogin(router: Router) {
        router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var client: Client = await this.clientRepository.findOneOrFail({ where: { emailCli: req.body.emailCli } })
                //TODO: USE JWT 
                if(client.confirmationCli != ""){
                    this.sendResponse(res,203, {message: "Veuillez confirmer votre compte"})
                }else if(client.passCli != req.body.passCli)
                    throw new Error("ERREUR")
                else
                    this.sendResponse(res,200,{message: "Authentification avec success"})
            } catch (error) {
                console.log(error)
                this.sendResponse(res,403,{message: "Email ou mot de passe incorrect"})
            }
        })
    }

    async addDelete(router: Router): Promise<void> { }

    async addPut(router: Router): Promise<void> { }
}