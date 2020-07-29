import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { DateLimite } from "../../../entities/DateLimite"
import { Repository, Connection, createConnection, getConnection, getRepository } from "typeorm";

import { runInThisContext } from "vm";
import ErrorValidator from "../../ErrorValidator";
import { body, param } from 'express-validator';
export default class DateLimiteController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllDateLimite(router)
    }


    private async getAllDateLimite(router: Router): Promise<void> {
        router.get("/",

            async (req: Request, res: Response, next: NextFunction) => {
                try {


                    let dateLimites: DateLimite[] = await getRepository(DateLimite).find({ where: { estSupprime: false } })

                    this.sendResponse(res, 200, dateLimites)
                } catch (err) {
                    this.sendResponse(res, 404, { message: "not found" })
                }
            })

    }

    private async fetchDateLimitesFromDatabase(): Promise<DateLimite[]> {
        return await getRepository(DateLimite).find({ where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {
        await this.postDateLimite(router)
    }

    async postDateLimite(router: Router) {
        router.post("/", [
            body(['limiteDat']).notEmpty().withMessage("Champs vide")
        ],
            ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
                let dateLimiteToSave: DateLimite = await this.createDateLimiteFromRequest(req)
                let dateLimiteSaved: DateLimite = await this.saveDateLimiteToDatabase(dateLimiteToSave)
                if (await this.isDateLimiteSaved(dateLimiteSaved)) {
                    this.sendResponse(res, 200, { message: "OK" })
                } else {
                    this.sendResponse(res, 400, { message: "KO" })
                }

            })
    }

    private async isDateLimiteSaved(dateLimite: DateLimite): Promise<boolean> {
        return dateLimite !== undefined
    }

    private async createDateLimiteFromRequest(req: Request): Promise<DateLimite> {
        let date = getRepository(DateLimite).create(req.body as Object)
        date.estSupprime = false
        return date
    }

    private async saveDateLimiteToDatabase(dateLimite: DateLimite): Promise<DateLimite> {
        return await getRepository(DateLimite).save(dateLimite)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idDate", [
            param('idDate').toInt().isNumeric().withMessage("invalid params"),
            body(['limiteDat']).notEmpty().withMessage("Champs vide")
        ],
            ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let date: DateLimite = await getRepository(DateLimite).findOneOrFail(Number(req.params.idDate))
                    date = getRepository(DateLimite).merge(date, req.body as Object)
                    date.estSupprime = false
                    await getRepository(DateLimite).save(date)
                    this.sendResponse(res, 200, { message: "Date changed" })
                } catch (error) {
                    console.log(error)
                    this.sendResponse(res, 404, { message: "Date not found" })
                }

            })
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idDate", [
            param('idDate').toInt().isNumeric().withMessage("invalid params"),
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let date: DateLimite = await getRepository(DateLimite).findOneOrFail(Number(req.params.idDate))
                    date.estSupprime = true
                    await getRepository(DateLimite).save(date)
                    this.sendResponse(res, 203, { message: "Date deleted" })
                } catch (error) {

                    this.sendResponse(res, 404, { message: "Date not found" })
                }

            })
    }
}