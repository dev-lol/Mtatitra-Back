import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Coursier } from "../../../entities/Coursier"
import { getRepository, Connection, createConnection, getConnection, MoreThan } from "typeorm";

import { Livraison } from "../../../entities/Livraison";
import { Etats } from "../../../entities/Etats";
import { CustomServer } from '../../Server';
import jwt from 'jsonwebtoken';
import { param, body } from 'express-validator';
import ErrorValidator from "../../ErrorValidator";
import { Resultat } from '../../../entities/Resultat';
export default class LivraisonController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.todayLivraison(router)
        await this.tomorrowLivraison(router)
    }

    async tomorrowLivraison(router): Promise<void> {
        router.get("/demain", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let tomorrowLiv: Livraison[] = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.idCliClient", "client")
                    .leftJoinAndSelect("livraison.idLimiteDat", "limiteDat")
                    .leftJoinAndSelect("livraison.idEtaEtats", "etat")
                    .leftJoinAndSelect("livraison.idLieDepart", "lieuA")
                    .leftJoinAndSelect("livraison.idLieArrivee", "lieuB")
                    .leftJoinAndSelect("lieuA.idZonZone", "zoneDepart")
                    .leftJoinAndSelect("lieuB.idZonZone", "zoneArrivee")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduits")
                    .where("livraison.idCouCoursier = :id", { id: res.locals.id })
                    .andWhere("livraison.dateLiv > CURRENT_DATE  ")
                    .andWhere("livraison.dateLiv < CURRENT_DATE +2 ")
                    .orderBy("livraison.idLiv", "ASC")
                    .getMany()

                this.sendResponse(res, 200, tomorrowLiv)
            } catch (err) {

            }
        })
    }
    async todayLivraison(router: Router): Promise<void> {
        router.get("/aujourdhui", async (req: Request, res: Response, next: NextFunction) => {
            try {
                const etatFinal = await getRepository(Etats).findOne({ order: { ordreEta: "DESC" } })
                console.log(etatFinal);
                let todo: Livraison[] = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.idCliClient", "client")
                    .leftJoinAndSelect("livraison.idLimiteDat", "limiteDat")
                    .leftJoinAndSelect("livraison.idEtaEtats", "etat")
                    .leftJoinAndSelect("livraison.idLieDepart", "lieuA")
                    .leftJoinAndSelect("livraison.idLieArrivee", "lieuB")
                    .leftJoinAndSelect("lieuA.idZonZone", "zoneDepart")
                    .leftJoinAndSelect("lieuB.idZonZone", "zoneArrivee")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduits")
                    .where("livraison.idCouCoursier = :id", { id: res.locals.id })
                    .andWhere("livraison.dateLiv >= CURRENT_DATE  ")
                    .andWhere("livraison.dateLiv < CURRENT_DATE +1 ")
                    .andWhere("livraison.idResResultat is null")
                    .andWhere("livraison.idEtaEtats is null")
                    .orderBy("livraison.idLiv", "ASC")
                    .getMany()

                let enCours: Livraison[] = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.idCliClient", "client")
                    .leftJoinAndSelect("livraison.idLimiteDat", "limiteDat")
                    .leftJoinAndSelect("livraison.idEtaEtats", "etat")
                    .leftJoinAndSelect("livraison.idLieDepart", "lieuA")
                    .leftJoinAndSelect("livraison.idLieArrivee", "lieuB")
                    .leftJoinAndSelect("lieuA.idZonZone", "zoneDepart")
                    .leftJoinAndSelect("lieuB.idZonZone", "zoneArrivee")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduits")
                    .where("livraison.idCouCoursier = :id", { id: res.locals.id })
                    .andWhere("livraison.dateLiv >= CURRENT_DATE  ")
                    .andWhere("livraison.dateLiv < CURRENT_DATE +1 ")
                    .andWhere("livraison.idResResultat is null")
                    .andWhere("livraison.idEtaEtats is not null")
                    .orderBy("livraison.idLiv", "ASC")
                    .getMany()

                let termine: Livraison[] = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.idCliClient", "client")
                    .leftJoinAndSelect("livraison.idLimiteDat", "limiteDat")
                    .leftJoinAndSelect("livraison.idEtaEtats", "etat")
                    .leftJoinAndSelect("livraison.idLieDepart", "lieuA")
                    .leftJoinAndSelect("livraison.idLieArrivee", "lieuB")
                    .leftJoinAndSelect("lieuA.idZonZone", "zoneDepart")
                    .leftJoinAndSelect("lieuB.idZonZone", "zoneArrivee")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduits")
                    .innerJoinAndSelect("livraison.idResResultat", "resultat")
                    .where("livraison.idCouCoursier = :id", { id: res.locals.id })
                    .andWhere("livraison.dateLiv >= CURRENT_DATE  ")
                    .andWhere("livraison.dateLiv < CURRENT_DATE +1 ")
                    .orderBy("livraison.idLiv", "ASC")
                    .getMany()

                this.sendResponse(res, 200, { todo: todo, enCours: enCours, termine: termine, etatFinal: etatFinal })
            } catch (err) {
                this.sendResponse(res, 404, err)
            }
        })
    }
    async addPost(router: Router): Promise<void> {
        this.postRapport(router)
    }
    async postRapport(router: Router): Promise<void> {
        router.post("/:idLivraison/rapport", [
            param(['idLivraison']).notEmpty().toInt().isNumeric().withMessage("Bad request"),
            body(['idResResultat']).toInt().isNumeric().withMessage("Resultat incorrecte"),
            body(['rapportLiv', 'idResResultat']).notEmpty().withMessage("Champs vide")
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            try {
                let liv = await getRepository(Livraison).findOneOrFail(req.params.idLivraison, { relations: ["idCliClient"] })
                liv.rapportLiv = req.body.rapportLiv
                liv.idResResultat = await getRepository(Resultat).findOneOrFail(req.body.idResResultat)
                await getRepository(Livraison).save(liv)
                CustomServer.ioClient.to(liv.idCliClient.idCli).emit("rapport", liv)
                this.sendResponse(res, 200, { message: "Rapport saved" })
            }
            catch (err) {
                this.sendResponse(res, 400, { message: "Not found" })
            }
        })
    }



    async addPut(router: Router): Promise<void> {
        await this.patchEtat(router)
    }

    async patchEtat(router): Promise<void> {
        router.patch("/:idLivraison/etats/:idEtat",
            [
                param(['idEtat', 'idLivraison']).notEmpty().toInt().isNumeric().withMessage("Bad request")
            ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let livraisonToUpdate: Livraison = await this.fetchLivraisonToUpdateFromDb(req)
                    livraisonToUpdate.idEtaEtats = await getRepository(Etats).findOneOrFail(req.params.idEtat)
                    let livraison = await getRepository(Livraison).save(livraisonToUpdate)
                    CustomServer.ioClient.to(livraisonToUpdate.idCliClient.idCli).emit("etats", livraisonToUpdate)
                    this.sendResponse(res, 200, {
                        message: "Etat changed"
                    })
                } catch (e) {
                    this.sendResponse(res, 400, { message: "Requette manquante" })
                    console.log(e)
                }
            })
        router.patch("/:idLivraison/commencer", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let livraisonToUpdate: Livraison = await this.fetchLivraisonToUpdateFromDb(req)
                livraisonToUpdate.idEtaEtats = await getRepository(Etats).findOneOrFail({ where: { ordreEta: 0 } })
                let livraison = await getRepository(Livraison).save(livraisonToUpdate)
                CustomServer.ioClient.to(livraisonToUpdate.idCliClient.idCli).emit("etats", livraisonToUpdate)
                this.sendResponse(res, 200, { message: "Etat changed" })
            } catch (e) {
                console.log(e)
            }
        })
    }

    private async fetchLivraisonToUpdateFromDb(req: Request): Promise<Livraison> {
        return await getRepository(Livraison).findOneOrFail(req.params.idLivraison, { relations: ["idCliClient"] })
    }


    async addDelete(router: Router): Promise<void> {

    }
}