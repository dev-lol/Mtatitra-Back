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
            body(['idZonDepart', 'idZonArrivee']).toInt().custom(async value => {
                try {
                    await getRepository(Zone).findOneOrFail(value)
                    return true
                } catch (error) {
                    return Promise.reject("Valeur incorrecte")
                }
            }).withMessage("not found"),
            body(['idTypeCouTypeCoursier']).toInt().custom(async value => {
                try {
                    await getRepository(TypeCoursier).findOneOrFail(value)
                    return true
                } catch (error) {
                    return Promise.reject("Valeur incorrecte")
                }
            }).withMessage("not found"),
            body('tarifTar').custom(value => {
                if (Number(value) < 0) {
                    return Promise.reject("Valeur incorrecte")
                } else {
                    return true;
                }
            }),
            body(['idZonDepart', 'idZonArrivee', 'idTypeCouTypeCoursier', 'tarifTar']).notEmpty().withMessage("Champs vide"),
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let tarifs: Tarif[] = []
                    let tarifToSave: Tarif = await getRepository(Tarif).create(req.body as Object)
                    tarifToSave.idTypeCouTypeCoursier = await getRepository(TypeCoursier).findOneOrFail(req.body.idTypeCouTypeCoursier)
                    tarifToSave.idZonDepart = await getRepository(Zone).findOneOrFail(req.body.idZonDepart)
                    tarifToSave.idZonArrivee = await getRepository(Zone).findOneOrFail(req.body.idZonArrivee)
                    tarifs.push(tarifToSave)
                    let tarif2 = { ...tarifToSave }
                    if (tarifToSave.idZonDepart.idZon != tarifToSave.idZonArrivee.idZon) {
                        [tarif2.idZonDepart, tarif2.idZonArrivee] = [tarif2.idZonArrivee, tarif2.idZonDepart]
                        tarifs.push(tarif2)
                    }
                    console.log(tarifs)
                    await this.saveTarifToDatabase(tarifs)

                    this.sendResponse(res, 201, { message: "OK" })
                } catch (error) {
                    if (error.code == 23505)
                        this.sendResponse(res, 400, { message: "Ce tarif existe déjà" })
                    else
                        this.sendResponse(res, 404, { message: "Not found" })
                }

            })
    }

    private async saveTarifToDatabase(tarif: Tarif[]): Promise<Tarif[]> {
        return await getRepository(Tarif).save(tarif)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idTarif", [
            param("idTarif").toInt().custom(async (value, { req }) => {
                try {
                    await getRepository(Tarif).findOneOrFail(value)
                    return true
                } catch (error) {
                    return Promise.reject("Valeur incorrecte")
                }
            }),
            body('tarifTar').custom(value => {
                if (Number(value) < 0) {
                    return Promise.reject("Valeur incorrecte")
                } else {
                    return true;
                }
            }),
            body(['tarifTar']).notEmpty().withMessage("Champs vide"),
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let tarif: Tarif = await getRepository(Tarif).findOneOrFail(Number(req.params.idTarif), { relations: ["idZonDepart", "idZonArrivee", "idTypeCouTypeCoursier"] })
                    const result = await getRepository(Tarif)
                        .createQueryBuilder("tarif")
                        .update()
                        .set({
                            tarifTar: req.body.tarifTar
                        })
                        .where("idTar = :id", { id: req.params.idTarif })
                        .orWhere("idZonArrivee = :idZon1", { idZon1: tarif.idZonDepart.idZon })
                        .andWhere("idZonDepart = :idZon2", { idZon2: tarif.idZonArrivee.idZon })
                        .andWhere("idTypeCouTypeCoursier = :idType", { idType: tarif.idTypeCouTypeCoursier.idTypeCou })
                        .execute()
                    if (result.affected > 0)
                        this.sendResponse(res, 200, { message: "Tarif changed" })
                    else {
                        throw "error"
                    }
                } catch (error) {
                    console.log(error)
                    if (error.code == 23505)
                        this.sendResponse(res, 400, { message: "Tarif doit etre unique" })
                    else
                        this.sendResponse(res, 404, { message: "Tarif not found" })
                }
            })
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idTarif", [
            param(['idTarif']).notEmpty().toInt().isNumeric().withMessage("Bad request")
        ], ErrorValidator,  async (req: Request, res: Response, next: NextFunction) => {
            try {
                let tarif: Tarif = await getRepository(Tarif).findOneOrFail(Number(req.params.idTarif), { relations: ["idZonDepart", "idZonArrivee", "idTypeCouTypeCoursier"] })
                let result = await getRepository(Tarif)
                    .createQueryBuilder("tarif")
                    .delete()
                    .where("idTar = :id", { id: req.params.idTarif })
                    .orWhere("idZonArrivee = :idZon1", { idZon1: tarif.idZonDepart.idZon })
                    .andWhere("idZonDepart = :idZon2", { idZon2: tarif.idZonArrivee.idZon })
                    .andWhere("idTypeCouTypeCoursier = :idType", { idType: tarif.idTypeCouTypeCoursier.idTypeCou })
                    .execute()
                if (result.affected > 0)
                    this.sendResponse(res, 203, { message: "Tarif deleted" })
                else {
                    throw "error"
                }
            } catch (error) {
                this.sendResponse(res, 404, { message: "Tarif not found" })
            }

        })
    }
}