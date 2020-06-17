import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Zone } from "../../../entities/Zone"
import { Repository, Connection, createConnection } from "typeorm";
import { ormconfig } from "../../../config";
import { runInThisContext } from "vm";
export default class ZoneController extends Controller {
    zoneRepository: Repository<Zone>
    constructor() {
        super()
        this.createConnectionAndAssignRepository()
            .then(async (_) => {
                await this.addAllRoutes(this.mainRouter)
            })
    }


    async createConnectionAndAssignRepository(): Promise<any> {
        let connection: Connection = await createConnection(ormconfig)
        this.zoneRepository = connection.getRepository(Zone)
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
        return await this.zoneRepository.find({ where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {
    }
    async addPut(router: Router): Promise<void> {
    }

    async addDelete(router: Router): Promise<void> {
    }
}