import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { TypeCoursier } from "../../../entities/TypeCoursier"
import { getRepository, Connection, createConnection, getConnection } from "typeorm";

import { runInThisContext } from "vm";
export default class TypeCoursierController extends Controller {
    constructor() {
        super()
this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllTypeCoursier(router)
    }


    private async getAllTypeCoursier(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let typeCoursiers: TypeCoursier[] = await this.fetchTypeCoursiersFromDatabase()

                this.sendResponse(res, 200, typeCoursiers)
            } catch (err) {

            }
        })

    }

    private async fetchTypeCoursiersFromDatabase(): Promise<TypeCoursier[]> {
        return await getRepository(TypeCoursier).find({ where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {

    }


    async addPut(router: Router): Promise<void> {

    }

    async addDelete(router: Router): Promise<void> {

    }
}