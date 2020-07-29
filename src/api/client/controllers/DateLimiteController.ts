import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { DateLimite } from "../../../entities/DateLimite"
import { Repository, getRepository } from "typeorm";

import { runInThisContext } from "vm";
export default class DateLimiteController extends Controller {
    dateLimiteRepository: Repository<DateLimite>
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllDateLimite(router)
    }


    private async getAllDateLimite(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let dateLimites: DateLimite[] = await this.fetchDateLimitesFromDatabase()
                this.sendResponse(res, 200, dateLimites)
            } catch (err) {
                console.log(err)
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

    }
    async addPut(router: Router): Promise<void> {
    }

    async addDelete(router: Router): Promise<void> {
    }
}