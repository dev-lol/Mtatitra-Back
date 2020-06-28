import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Zone } from "../../../entities/Zone"
import { getRepository} from "typeorm";
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

                this.sendResponse(res, 200, zones)
            } catch (err) {

            }
        })

    }

    private async fetchZonesFromDatabase(): Promise<Zone[]> {
        return await getRepository(Zone).find({ where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {
        await this.postZone(router)
    }

    async postZone(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            let zoneToSave: Zone = await this.createZoneFromRequest(req)

            zoneToSave.estSupprime = false
            let zoneSaved: Zone = await this.saveZoneToDatabase(zoneToSave)

            if (await this.isZoneSaved(zoneSaved)) {
                this.sendResponse(res, 200, { message: "OK" })
            } else {
                this.sendResponse(res, 400, { message: "KO" })
            }

        })
    }

    private async isZoneSaved(zone: Zone): Promise<boolean> {
        return zone !== undefined
    }

    private async createZoneFromRequest(req: Request): Promise<Zone> {
        let zone = getRepository(Zone).create(req.body as Object)
        return zone
    }

    private async saveZoneToDatabase(zone: Zone): Promise<Zone> {
        return await getRepository(Zone).save(zone)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idZone", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let zone: Zone = await getRepository(Zone).findOneOrFail(Number(req.params.idZone))
                zone = getRepository(Zone).merge(zone, req.body as Object)
                zone.estSupprime = false
                await getRepository(Zone).save(zone)
                this.sendResponse(res, 200, { message: "Zone changed" })
            } catch (error) {
                console.log(error)
                this.sendResponse(res, 404, { message: "Zone not found" })
            }

        })
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idZone", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let zone: Zone = await getRepository(Zone).findOneOrFail(Number(req.params.idZone))
                zone.estSupprime = true
                await getRepository(Zone).save(zone)
                this.sendResponse(res, 203, { message: "Zone deleted" })
            } catch (error) {
                this.sendResponse(res, 404, { message: "Zone not found" })
            }

        })
    }
}