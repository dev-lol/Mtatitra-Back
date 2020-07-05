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
            query(['lieuDepart', 'lieuArrivee', 'typeCoursier']).notEmpty().withMessage("error query"),
            query('lieuDepart').custom((value, { req }) => value != req.query.lieuArrivee).withMessage("same value"),
            query('lieuArrivee').custom((value, { req }) => value != req.query.lieuDepart).withMessage("same value")
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const dep = req.query.lieuDepart
                const arr = req.query.lieuArrivee
                const type = req.query.typeCoursier
                let tarifs = await getRepository(Tarif)
                    .createQueryBuilder("tarif")
                    .leftJoin("tarif.idZonDepart", "zoneDepart")
                    .leftJoin("zoneDepart.lieu", "lieuDepart")
                    .leftJoin("tarif.idZonArrivee", "zoneArrivee")
                    .leftJoin("zoneArrivee.lieu", "lieuArrivee")
                    .where("tarif.idTypeCouTypeCoursier = :typeCou", { typeCou: type })
                    .andWhere("lieuArrivee.idLie = :idDepart", { idDepart: dep })
                    .andWhere("lieuDepart.idLie = :idArrivee", { idArrivee: arr })
                    .orWhere("lieuArrivee.idLie = :idDepart2", { idDepart2: arr })
                    .andWhere("lieuDepart.idLie = :idArrivee2", { idArrivee2: dep })
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