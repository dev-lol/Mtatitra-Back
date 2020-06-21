import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";

import { Controller } from "../../Controller";
import { getRepository } from 'typeorm';
import { createConnection } from 'typeorm';
import { ormconfig } from '../../../config';
import { Repository } from 'typeorm';
import { Client } from '../../../entities/Client';
import Utils from '../../../utils/SendEmail';

export default class SignupController extends Controller {

    constructor() {
        super()
        this.addAllRoutes(this.mainRouter);

    }

    async addGet(router: Router): Promise<void> {
        
    }


    async addPost(router: Router): Promise<void> {
        await this.postSignup(router)
        await this.postResend(router)
        await this.postConfirmation(router)
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
                var count = await getRepository(Client).count({ where: { emailCli: req.body.emailCli } })
                if (count > 0) {
                    throw new Error("Email deja utilisé")
                }
                var client: Client = getRepository(Client).create(req.body as Object)

                let bcrypt = require("bcrypt")
                await bcrypt.hash(client.passCli, Number(process.env.SALT), async (err, hash) => {
                    if (err)
                        throw err
                    client.passCli = hash
                    client.confirmationCli = Math.floor((Math.random() * (999999 - 100000)) + 100000).toString()
                    await getRepository(Client).save(client).then(_ => {
                        Utils.sendEmail(client.emailCli, client.confirmationCli)
                    })
                    this.sendResponse(res, 200, { message: "Veuillez confirmer votre compte via email" })
                });
            } catch (error) {
                this.sendResponse(res, 400, { message: error.toString() })
            }
        })
    }

    async postResend(router: Router) {
        router.post("/resend", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var client: Client = await getRepository(Client).findOneOrFail({ where: { emailCli: req.body.emailCli } })
                if (client.confirmationCli == "") {
                    throw new Error("Compte deja confirmé")
                }
                Utils.sendEmail(client.emailCli, client.confirmationCli)
                this.sendResponse(res, 200, { message: "Veuillez confirmer votre compte via email" })
            } catch (error) {
                this.sendResponse(res, 400, { message: error.toString() })
            }
        })
    }

    async postReset(router: Router) {
        router.post("/reset", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var client: Client = await getRepository(Client).findOneOrFail({ where: { emailCli: req.body.emailCli } })
                client.resetCodeCli = Math.floor((Math.random() * (999999 - 100000)) + 100000).toString()
                await getRepository(Client).save(client)
                Utils.sendResetEmail(client.emailCli, client.resetCodeCli)
                this.sendResponse(res, 200, { message: "Veuillez confirmer votre compte via email" })
            } catch (error) {
                this.sendResponse(res, 400, { message: error.toString() })
            }
        })
    }

    /**
     *
     *
     * @param {Router} router
     * @memberof SignupController
     */
    async postConfirmation(router: Router) {
        router.post("/confirmation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var client: Client = await getRepository(Client).findOneOrFail({ where: { emailCli: req.body.email} })
                if (client.confirmationCli == req.body.code) {
                    client.confirmationCli = ""
                }
                await getRepository(Client).save(client)
                this.sendResponse(res,200,{message: "Confirmation succesfully"})
            } catch (error) {
                this.sendResponse(res,400,{message: "Bad request"})

            }
        })
    }

    async addDelete(router: Router): Promise<void> { }

    async addPut(router: Router): Promise<void> { }
}