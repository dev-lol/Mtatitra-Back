import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Tarif } from "../../../entities/Tarif"
import { getRepository } from "typeorm";
import { ormconfig } from "../../../config";
import { TypeCoursier } from '../../../entities/TypeCoursier';
import { Zone } from "../../../entities/Zone";
export default class TarifController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllTarif(router)
        await this.getTarif(router)
    }


    private async getAllTarif(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let tarifs = await this.fetchTarifsFromDatabase()

                this.sendResponse(res, 200, tarifs)
            } catch (err) {
                console.log(err)
                this.sendResponse(res, 404, { message: "Tarif not found" })

            }
        })

    }

    private async getTarif(router: Router): Promise<void> {
        router.get("/typecoursier/:typeCoursier/zone/:zone", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let tarifs = await getRepository(Tarif).findOneOrFail({
                    where: {
                        idTypeCouTypeCoursier: req.params.typeCoursier,
                        idZonZone: req.params.zone
                    }
                })
                this.sendResponse(res, 200, tarifs)
            } catch (err) {
                console.log(err)
                this.sendResponse(res, 404, { message: "Tarif not found" })

            }
        })

    }

    private async fetchTarifsFromDatabase(): Promise<TypeCoursier[]> {
        return await getRepository(TypeCoursier)
            .createQueryBuilder("typeCoursier")
            .innerJoinAndSelect("typeCoursier.tarifs", "tarif")
            .leftJoinAndSelect("tarif.idZonZone", "zone")
            .where("typeCoursier.estSupprime = false")
            .where("zone.estSupprime = false")
            .getMany()
    }
    async addPost(router: Router): Promise<void> {
    }
    async addPut(router: Router): Promise<void> {

    }

    async addDelete(router: Router): Promise<void> {

    }
}