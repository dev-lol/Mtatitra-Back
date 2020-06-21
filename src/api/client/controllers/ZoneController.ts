import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Zone } from "../../../entities/Zone"
import { getRepository } from "typeorm";
import { ormconfig } from "../../../config";
import { runInThisContext } from "vm";
export default class ZoneController extends Controller {
    constructor() {
        super()
this.addAllRoutes(this.mainRouter)
    }



    async addGet(router: Router): Promise<void> {
        await this.getAllZone(router)
    }


    private async getAllZone(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let zones: Zone[] = await this.fetchZonesFromDatabase()

                this.sendResponse(res, 200,  zones)
            } catch (err) {

            }
        })

    }

    private async fetchZonesFromDatabase(): Promise<Zone[]> {
        return await getRepository(Zone).find({ where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {
    }
    async addPut(router: Router): Promise<void> {
    }

    async addDelete(router: Router): Promise<void> {
    }
}