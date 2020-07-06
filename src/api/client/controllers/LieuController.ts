import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Lieu } from "../../../entities/Lieu"
import { getRepository } from "typeorm";
export default class LieuController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }



    async addGet(router: Router): Promise<void> {
        await this.getAllLieu(router)
    }


    private async getAllLieu(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let lieu: Lieu[] = await this.fetchLieusFromDatabase()
                this.sendResponse(res, 200, lieu)
            } catch (err) {

            }
        })

    }

    private async fetchLieusFromDatabase(): Promise<Lieu[]> {
        return await getRepository(Lieu).find()
    }
    async addPost(router: Router): Promise<void> {
    }
    async addPut(router: Router): Promise<void> {
    }

    async addDelete(router: Router): Promise<void> {
    }
}