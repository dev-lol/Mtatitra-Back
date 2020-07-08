import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Zone } from "../../../entities/Zone"
import { getRepository } from "typeorm";
import ErrorValidator from "../../ErrorValidator";
import { query, sanitizeQuery, check, body, param } from "express-validator";
import { Lieu } from '../../../entities/Lieu';
export default class ZoneController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllZone(router)
        await this.statByZone(router)
    }


    private async getAllZone(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let zones: Zone[] = await this.fetchZonesFromDatabase()

                this.sendResponse(res, 200, zones)
            } catch (err) {
                this.sendResponse(res, 404, { message: "not found" })
            }
        })

    }


    private async statByZone(router: Router): Promise<void> {
        router.get("/stat", [
            query(['start', 'end']).notEmpty().toDate().isISO8601().toDate().withMessage("invalid start or end")
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const startDate: Date = new Date(req.query.start as string)
                    const endDate: Date = new Date(req.query.end as string)
                    let a = await getRepository(Zone)
                        .createQueryBuilder("zone")
                        .leftJoinAndSelect("zone.lieu", "lieu")
                        .leftJoinAndSelect("lieu.livraisons2", "livraison", "livraison.dateLiv >= :startDate AND livraison.dateLiv <= :endDate", { startDate: startDate, endDate: endDate })
                        .select(`zone.nomZon as "nomZon"`)
                        .addSelect(`zone.idZon as "idZon"`)
                        .addSelect(`count(livraison) as total`)
                        .groupBy("zone.idZon")
                        .orderBy("total", "DESC")
                        .addOrderBy("zone.idZon", "ASC")
                        .getRawMany()
                    this.sendResponse(res, 200, a)
                } catch (err) {
                    console.log(err)
                    this.sendResponse(res, 404, { message: "not found" })

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
        router.post("/", [
            body(['nomZon']).notEmpty().withMessage("Champs vide"),
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
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
        router.put("/:idZone", [
            body(['nomZon']).notEmpty().withMessage("Champs vide"),
            param('idZone').notEmpty().toInt().isNumeric().withMessage("bad request")
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
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
        router.delete("/:idZone", [
            param('idZone').notEmpty().toInt().isNumeric().withMessage("bad request")
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
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