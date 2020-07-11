import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { getRepository } from "typeorm";
import ErrorValidator from "../../ErrorValidator";
import { query, sanitizeQuery, check, body, param } from "express-validator";
import { Resultat } from '../../../entities/Resultat';
export default class ResultatController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllResultat(router)
    }


    private async getAllResultat(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let resultats: Resultat[] = await getRepository(Resultat).find()
                this.sendResponse(res, 200, resultats)
            } catch (err) {
                this.sendResponse(res, 404, { message: "not found" })
            }
        })

    }
    async addPost(router: Router): Promise<void> {
        await this.postResultat(router)
    }

    async postResultat(router: Router) {

    }

    async addPut(router: Router): Promise<void> {

    }

    async addDelete(router: Router): Promise<void> {

    }
}