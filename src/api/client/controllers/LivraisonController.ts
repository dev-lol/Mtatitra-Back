import { Controller } from "../../Controller";
import { getRepository } from "typeorm";


import { Client } from "../../../entities/Client";
import { Router, Response, Request, NextFunction } from "express";
import { Livraison } from "../../../entities/Livraison";
import { Produit } from "../../../entities/Produit";
import { ormconfig } from "../../../config";
import { TypeProduit } from "../../../entities/TypeProduit";
import { Coursier } from "../../../entities/Coursier";
import { Zone } from "../../../entities/Zone";
import { DateLimite } from "../../../entities/DateLimite";
import { TypeCoursier } from "../../../entities/TypeCoursier";
import { Etats } from '../../../entities/Etats';
export default class LivraisonController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router) {
        await this.allLivraison(router)

    }

    async allLivraison(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                const last = await getRepository(Etats).findOneOrFail({ order: { ordreEta: 'DESC' } })
                const planifie = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .select()
                    .where("livraison.dateLiv > CURRENT_DATE")
                    .andWhere("livraison.idCliClient = :idCli", { idCli: res.locals.id })
                    .orWhere("livraison.idEtaEtats is null")
                    .andWhere("livraison.dateLiv = CURRENT_DATE")
                    .andWhere("livraison.idCliClient = :idCli", { idCli: res.locals.id })
                    .getMany()

                const en_cours = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .select()
                    .where("livraison.idEtaEtats is not null")
                    .andWhere("livraison.idEtaEtats <> :id", { id: last.idEta })
                    .andWhere("livraison.dateLiv = CURRENT_DATE")
                    .andWhere("livraison.idCliClient = :idCli", { idCli: res.locals.id })
                    .getMany()
                const historique = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .select()
                    .where("livraison.dateLiv < CURRENT_DATE")
                    .orWhere("livraison.idEtaEtats = :id", { id: last.idEta })
                    .andWhere("livraison.idCliClient = :idCli", { idCli: res.locals.id })
                    .getMany()
                this.sendResponse(res, 200, {
                    planifie: planifie,
                    enCours: en_cours,
                    historique: historique
                })
            } catch (error) {
                console.log(error)
                this.sendResponse(res, 404, { message: "not found" })

            }
        })
    }
    async addPost(router: Router) {
        await this.setLivraison(router)

    }
    async setLivraison(router: Router): Promise<void> {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                console.log(req.body.livraison)
                let produits: Produit[] = []
                for (const p of req.body.produits) {
                    const produit: Produit = getRepository(Produit).create(p as object)
                    produit.idTypeProTypeProduit = { ...new TypeProduit(), idTypePro: p["typePro"] }
                    produits.push(produit)
                }
                const livraison: Livraison = getRepository(Livraison).create(req.body.livraison as object)
                livraison.produits = produits;
                livraison.idZonArrivee = { ... new Zone(), idZon: req.body.livraison.zoneLiv }
                livraison.idCliClient = { ... new Client(), idCli: res.locals.id }
                livraison.idLimiteDat = { ... new DateLimite(), idLimiteDat: req.body.livraison.dateLimite }
                livraison.expressLiv = new Date(req.body.dateLiv).toDateString() == new Date().toDateString()
                livraison.idTypeCouTypeCoursier = { ... new TypeCoursier(), idTypeCou: req.body.livraison.typeCoursier }
                await getRepository(Livraison).save(livraison)
                this.sendResponse(res, 200, { message: "livraison inseré" })
            } catch (err) {
                console.log(err)
                this.sendResponse(res, 404, { message: err })
            }
        })
    }
    async addDelete(router: Router) { }
    async addPut(router: Router) { }


}