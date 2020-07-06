import { Router, Response, Request, NextFunction } from "express";
import { Controller } from "../../Controller"
import { Tarif } from "../../../entities/Tarif"
import { getRepository } from "typeorm";
import { TypeCoursier } from '../../../entities/TypeCoursier';
import { Zone } from "../../../entities/Zone";
import ErrorValidator from "../../ErrorValidator";
import { body, param } from 'express-validator';
export default class TarifController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllTarif(router)
    }


    private async getAllTarif(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let tarifs: Tarif[] = await this.fetchTarifsFromDatabase()
                this.sendResponse(res, 200, tarifs)
            } catch (err) {
                this.sendResponse(res, 404, { message: "not found" })
            }
        })

    }

    private async fetchTarifsFromDatabase(): Promise<Tarif[]> {

        return await getRepository(Tarif).createQueryBuilder("tarif")
            .leftJoinAndSelect("tarif.idTypeCouTypeCoursier", "typeCoursier")
            .leftJoinAndSelect("tarif.idZonDepart", "zoneDepart")
            .leftJoinAndSelect("tarif.idZonArrivee", "zoneArrivee")
            .orderBy(`"typeCoursier"."type_cou"`)
            .getMany()
    }
    async addPost(router: Router): Promise<void> {
        await this.postTarif(router)
    }

    async postTarif(router: Router) {
        router.post("/", [
            body(['idZonDepart', 'idZonArrivee', 'idTypeCouTypeCoursier', 'tarifTar',]).notEmpty().withMessage("value invalid"),
            body(['idZonDepart', 'idZonArrivee']).custom(value => {
                return getRepository(Zone).findOneOrFail(value)
            }).withMessage("not found"),
            body(['idTypeCouTypeCoursier']).custom(value => {
                return getRepository(TypeCoursier).findOneOrFail(value)
            }).withMessage("not found"),
            body('tarifTar').isNumeric().custom(value => {
                if (value < 0) {
                    return Promise.reject("value invalid")
                }
            })
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let tarifToSave: Tarif = await getRepository(Tarif).create(req.body as Object)
                    tarifToSave.idTypeCouTypeCoursier = await getRepository(TypeCoursier).findOneOrFail(req.body.idTypeCouTypeCoursier)
                    tarifToSave.idZonDepart = await getRepository(Zone).findOneOrFail(req.body.idZonDepart)
                    tarifToSave.idZonArrivee = await getRepository(Zone).findOneOrFail(req.body.idZonArrivee)
                    await this.saveTarifToDatabase(tarifToSave)

                    this.sendResponse(res, 201, { message: "OK" })
                } catch (error) {
                    if (error.code == 23505)
                        this.sendResponse(res, 400, { message: "Tarif doit etre unique" })
                    else
                        this.sendResponse(res, 404, { message: "Not found" })
                }

            })
    }

    private async saveTarifToDatabase(tarif: Tarif): Promise<Tarif> {
        return await getRepository(Tarif).save(tarif)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idTarif", [
            param('idTarif').notEmpty().isNumeric().withMessage("invalid ID"),
            body(['idZonDepart', 'idZonArrivee', 'idTypeCouTypeCoursier', 'tarifTar',]).notEmpty().withMessage("value invalid"),
            body(['idZonDepart', 'idZonArrivee']).custom(value => {
                return getRepository(Zone).findOneOrFail(value)
            }).withMessage("not found"),
            body(['idTypeCouTypeCoursier']).custom(value => {
                return getRepository(TypeCoursier).findOneOrFail(value)
            }).withMessage("not found"),
            body('tarifTar').isNumeric().custom(value => {
                if (value < 0) {
                    return Promise.reject("value invalid")
                }
            })
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let tarif: Tarif = await getRepository(Tarif).findOneOrFail(Number(req.params.idTarif))
                    tarif = getRepository(Tarif).merge(tarif, req.body as Object)
                    tarif.idTypeCouTypeCoursier = await getRepository(TypeCoursier).findOneOrFail(req.body.idTypeCouTypeCoursier)
                    tarif.idZonDepart = await getRepository(Zone).findOneOrFail(req.body.idZonDepart)
                    tarif.idZonArrivee = await getRepository(Zone).findOneOrFail(req.body.idZonArrivee)
                    await getRepository(Tarif).save(tarif)
                    this.sendResponse(res, 200, { message: "Tarif changed" })
                } catch (error) {
                    if (error.code == 23505)
                        this.sendResponse(res, 400, { message: "Tarif doit etre unique" })
                    else
                        this.sendResponse(res, 404, { message: "Tarif not found" })
                }

            })
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idTarif", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let tarif: Tarif = await getRepository(Tarif).findOneOrFail(Number(req.params.idTarif))
                await getRepository(Tarif).remove(tarif)
                this.sendResponse(res, 203, { message: "Tarif deleted" })
            } catch (error) {
                this.sendResponse(res, 404, { message: "Tarif not found" })
            }

        })
    }
}