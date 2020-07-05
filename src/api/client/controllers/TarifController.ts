import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Tarif } from "../../../entities/Tarif"
import { getRepository } from "typeorm";
import { ormconfig } from "../../../config";
import { TypeCoursier } from '../../../entities/TypeCoursier';
import { Zone } from "../../../entities/Zone";
import ErrorValidator from "../../ErrorValidator";
import { query } from "express-validator";
export default class TarifController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getTarif(router)
    }


    private async getTarif(router: Router): Promise<void> {
        router.get("/", [
            query(['zoneDepart', 'zoneArrivee', 'typeCoursier']).notEmpty().withMessage("error query"),
            query('zoneDepart').custom((value, { req }) => value != req.query.zoneArrivee).withMessage("same value"),
            query('zoneArrivee').custom((value, { req }) => value != req.query.zoneDepart).withMessage("same value")
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const dep = req.query.zoneDepart
                const arr = req.query.zoneArrivee
                const type = req.query.typeCoursier
                let tarifs = await getRepository(Tarif)
                    .createQueryBuilder("tarif")
                    .where("tarif.idTypeCouTypeCoursier = :typeCou", { typeCou: type })
                    .andWhere("tarif.idZonDepart = :idDepart", { idDepart: dep })
                    .andWhere("tarif.idZonArrivee = :idArrivee", { idArrivee: arr })
                    .orWhere("tarif.idZonDepart = :idDepart2", { idDepart2: arr })
                    .andWhere("tarif.idZonArrivee = :idArrivee2", { idArrivee2: dep })
                    .getOne()

                this.sendResponse(res, 200, tarifs)
            } catch (err) {
                console.log(err)
                this.sendResponse(res, 404, { message: "Tarif not found" })

            }
        })

    }
    async addPost(router: Router): Promise<void> {
    }
    async addPut(router: Router): Promise<void> {

    }

    async addDelete(router: Router): Promise<void> {

    }
}