import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Lieu } from "../../../entities/Lieu"
import { getRepository } from "typeorm";
import ErrorValidator from "../../ErrorValidator";
import { query, sanitizeQuery, check, body, param } from "express-validator";
import { Zone } from "../../../entities/Zone";

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

                let lieu = await getRepository(Zone)
                    .createQueryBuilder("zone")
                    .leftJoinAndSelect("zone.lieu", "lieu")
                    .getMany()
                this.sendResponse(res, 200, lieu)
            } catch (err) {
                this.sendResponse(res, 404, { message: "not found" })
            }
        })

    }
    async addPost(router: Router): Promise<void> {
        await this.postLieu(router)
    }

    async postLieu(router: Router) {
        router.post("/", [
            body('idZonZone').toInt().isNumeric().withMessage("value error"),
            body(['idZonZone', 'nomLie']).notEmpty().withMessage("Champs vide"),
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {

                    let lieuToSave: Lieu = await this.createLieuFromRequest(req)
                    lieuToSave.idZonZone = await getRepository(Zone).findOneOrFail(req.body.idZonZone)
                    let lieuSaved: Lieu = await this.saveLieuToDatabase(lieuToSave)
                    this.sendResponse(res, 200, { message: "OK" })
                } catch (error) {
                    this.sendResponse(res, 400, { message: "KO" })

                }

            })
    }

    private async isLieuSaved(lieu: Lieu): Promise<boolean> {
        return lieu !== undefined
    }

    private async createLieuFromRequest(req: Request): Promise<Lieu> {
        let lieu = getRepository(Lieu).create(req.body as Object)
        return lieu
    }

    private async saveLieuToDatabase(lieu: Lieu): Promise<Lieu> {
        return await getRepository(Lieu).save(lieu)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idLieu", [
            param('idLieu').notEmpty().toInt().isNumeric().withMessage("params error"),
            body(['idZonZone', 'nomLie']).notEmpty().withMessage("champs vide"),
            body('idZonZone').toInt().isNumeric().withMessage("value error")
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let lieu: Lieu = await getRepository(Lieu).findOneOrFail(Number(req.params.idLieu))
                    lieu = getRepository(Lieu).merge(lieu, req.body as Object)
                    lieu.idZonZone = await getRepository(Zone).findOneOrFail(req.body.idZonZone)
                    await getRepository(Lieu).save(lieu)
                    this.sendResponse(res, 200, { message: "Lieu changed" })
                } catch (error) {
                    console.log(error)
                    this.sendResponse(res, 404, { message: "Lieu not found" })
                }

            })
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idLieu", [
            param('idLieu').notEmpty().toInt().isNumeric().withMessage("params error"),
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            try {
                let lieu: Lieu = await getRepository(Lieu).findOneOrFail(Number(req.params.idLieu))
                await getRepository(Lieu).remove(lieu)
                this.sendResponse(res, 203, { message: "Lieu deleted" })
            } catch (error) {
                this.sendResponse(res, 404, { message: "Lieu not found" })
            }

        })
    }
}