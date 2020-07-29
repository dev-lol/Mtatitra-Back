import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Etats } from "../../../entities/Etats"
import { Repository, Connection, createConnection, getConnection, getRepository } from "typeorm";

export default class EtatsController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllEtats(router)
    }


    private async getAllEtats(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let etats: Etats[] = await this.fetchEtatssFromDatabase()

                this.sendResponse(res, 200, etats)
            } catch (err) {
                this.sendResponse(res, 404, { message: "Not found" })
            }
        })

    }

    private async fetchEtatssFromDatabase(): Promise<Etats[]> {
        return await getRepository(Etats).find({ where: { estSupprime: false }, order: { ordreEta: "ASC" } })
    }
    async addPost(router: Router): Promise<void> {
    }

    async addPut(router: Router): Promise<void> {
    }

    async addDelete(router: Router): Promise<void> {

    }
}