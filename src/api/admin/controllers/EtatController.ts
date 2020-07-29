import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Etats } from "../../../entities/Etats"
import { Repository, Connection, createConnection, getConnection, getRepository } from "typeorm";

import { runInThisContext } from "vm";
import { json } from "body-parser";
import ErrorValidator from "../../ErrorValidator";
import { body, param } from 'express-validator';
export default class EtatsController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllEtats(router)
    }


    private async getAllEtats(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let etatss: Etats[] = await this.fetchEtatssFromDatabase()

                this.sendResponse(res, 200, etatss)
            } catch (err) {

            }
        })

    }

    private async fetchEtatssFromDatabase(): Promise<Etats[]> {
        return await getRepository(Etats).find({ where: { estSupprime: false }, order: { ordreEta: "ASC" } })
    }
    async addPost(router: Router): Promise<void> {
        await this.postEtats(router)
    }

    async postEtats(router: Router) {
        router.post("/", [
            body(['etatEta']).notEmpty().withMessage("Champs vide")
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {

                    let etatsToSave: Etats = await this.createEtatsFromRequest(req)
                    const lastEtat = (await getRepository(Etats).findOne({ order: { ordreEta: "DESC" } })).ordreEta
                    if (lastEtat)
                        etatsToSave.ordreEta = lastEtat + 1
                    else
                        etatsToSave.ordreEta = 0
                    let etatsSaved: Etats = await this.saveEtatsToDatabase(etatsToSave)
                    this.sendResponse(res, 200, { message: "OK" })
                } catch (error) {
                    this.sendResponse(res, 400, { message: "KO" })
                }
            })
    }

    private async createEtatsFromRequest(req: Request): Promise<Etats> {
        let etats = getRepository(Etats).create(req.body as Object)
        return etats
    }

    private async saveEtatsToDatabase(etats: Etats): Promise<Etats> {
        return await getRepository(Etats).save(etats)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/", [
            body(['etapes']).notEmpty().withMessage("Champs vide")
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            try {

                let etats: Etats[] = await getRepository(Etats).save(req.body.etapes)
                let notRemove = []
                for (const etat of etats) {
                    notRemove.push(etat.idEta)
                }
                await getRepository(Etats).createQueryBuilder().delete().where("idEta not in (:...notRemove)", { notRemove: notRemove }).execute()
                this.sendResponse(res, 200, { message: "Etats changed" })
            } catch (error) {
                console.log(error)
                this.sendResponse(res, 404, { message: "Etats not found" })
            }

        })

        this.patchOrdre(router);
    }
    /**
     *
     *
     * @private
     * @param {Router} router
     * @memberof EtatsController
     * 
     * donnee entree:
     * 
     * ordre = {idEta: ordre} 
     * exemple: {1:3, 2:4}
     * 
     */
    private patchOrdre(router: Router) {
        router.patch("/ordre", [
            body('ordre').isJSON().withMessage("value error")
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    var ordre: Object = JSON.parse(req.body.ordre)
                    let count = await getRepository(Etats).count()
                    if (Object.keys(ordre).length != count || (new Set(Object.values(ordre))).size != count)
                        throw new Error("Ordre dupliquee ou manquante")
                    var etats = await getRepository(Etats).find()
                    for (let etat of etats) {
                        etat.ordreEta = ordre[etat.idEta]
                    }
                    await getRepository(Etats).save(etats);
                    this.sendResponse(res, 200, { message: "Ordre changed" });
                }
                catch (error) {
                    console.log(error);
                    this.sendResponse(res, 404, { message: "Ordre not changed" });
                }
            });
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idEtats", [
            param('idEtats').notEmpty().toInt().isNumeric().withMessage("params error")
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            try {
                let etats: Etats = await getRepository(Etats).findOneOrFail(Number(req.params.idEtats))
                await getRepository(Etats).remove(etats)
                this.sendResponse(res, 203, { message: "Etats deleted" })
            } catch (error) {
                this.sendResponse(res, 404, { message: "Etats not found" })
            }

        })
    }
}