import { Controller } from "../../Controller";
import { getRepository } from "typeorm";


import { Client } from "../../../entities/Client";
import { Router, Response, Request, NextFunction } from "express";
import { Livraison } from "../../../entities/Livraison";
import { Produit } from "../../../entities/Produit";

import { TypeProduit } from "../../../entities/TypeProduit";
import { Coursier } from "../../../entities/Coursier";
import { Zone } from "../../../entities/Zone";
import { DateLimite } from "../../../entities/DateLimite";
import { TypeCoursier } from "../../../entities/TypeCoursier";
import { Etats } from '../../../entities/Etats';
import ErrorValidator from "../../ErrorValidator";
import { body } from 'express-validator';
import { Lieu } from "../../../entities/Lieu";
import { CustomServer } from "../../Server";
import { print } from "util";
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
                    .leftJoin("livraison.idEtaEtats", "etats")
                    .leftJoinAndSelect("livraison.idLimiteDat", "limiteDate")
                    .leftJoinAndSelect("livraison.idTypeCouTypeCoursier", "typeCoursier")
                    .leftJoinAndSelect("livraison.idLieArrivee", "lieArrivee")
                    .leftJoinAndSelect("livraison.idLieDepart", "lieDepart")
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
                    .leftJoinAndSelect("livraison.idEtaEtats", "etats")
                    .leftJoinAndSelect("livraison.idLimiteDat", "limiteDate")
                    .leftJoinAndSelect("livraison.idTypeCouTypeCoursier", "typeCoursier")
                    .leftJoinAndSelect("livraison.idLieArrivee", "lieArrivee")
                    .leftJoinAndSelect("livraison.idLieDepart", "lieDepart")
                    .select()
                    .where("livraison.idEtaEtats is not null")
                    .andWhere("livraison.idEtaEtats <> :id", { id: last.idEta })
                    .andWhere("livraison.dateLiv = CURRENT_DATE")
                    .andWhere("livraison.idCliClient = :idCli", { idCli: res.locals.id })
                    .getMany()
                const historique = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .leftJoinAndSelect("livraison.idEtaEtats", "etats")
                    .leftJoinAndSelect("livraison.idLimiteDat", "limiteDate")
                    .leftJoinAndSelect("livraison.idTypeCouTypeCoursier", "typeCoursier")
                    .leftJoinAndSelect("livraison.idLieArrivee", "lieArrivee")
                    .leftJoinAndSelect("livraison.idLieDepart", "lieDepart")
                    .leftJoinAndSelect("livraison.idResResultat", "resultat")
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
        router.post("/", [
            body('produits').isArray().notEmpty().withMessage("pas de produits"),
            body(['produits.*.largeurPro', 'produits.*.longueurPro', 'produits.*.hauteurPro', 'produits.*.poidsPro'])
                .isNumeric()
                .withMessage('Valeur incorrecte'),
            body(['produits.*.largeurPro', 'produits.*.longueurPro', 'produits.*.hauteurPro', 'produits.*.consignePro', 'produits.*.poidsPro', 'produits.*.fragilePro'])
                .notEmpty()
                .withMessage("Champs vide"),
            body('produits.*.fragilePro').isBoolean().withMessage("non boolean"),
            body('livraison').notEmpty().withMessage("pas de details"),
            body(['livraison.idLieArrivee', 'livraison.idLieDepart', 'livraison.idLimiteDat',
                'livraison.typeCoursier']).isInt().withMessage("donne invalide"),
            body(['livraison.numRecepLiv', 'livraison.dateLiv', 'livraison.idLieArrivee', 'livraison.idLieDepart', 'livraison.idLimiteDat',
                'livraison.typeCoursier']).notEmpty().withMessage("Champs vide"),
            body(['numRecepLiv']).not().matches(/^3[2-49]\d{7}$/).withMessage("Numero telephone incorrecte"),
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    console.log(req.body.livraison.dateLiv)
                    let produits: Produit[] = []
                    for (const p of req.body.produits) {
                        const produit: Produit = getRepository(Produit).create(p as object)
                        produit.idTypeProTypeProduit = { ...new TypeProduit(), idTypePro: p["typePro"] }
                        produits.push(produit)
                    }
                    const livraison: Livraison = getRepository(Livraison).create(req.body.livraison as object)
                    livraison.produits = produits;
                    livraison.idLieArrivee = { ... new Lieu(), idLie: req.body.livraison.idLieArrivee }
                    livraison.idLieDepart = { ... new Lieu(), idLie: req.body.livraison.idLieDepart }
                    livraison.idCliClient = { ... new Client(), idCli: res.locals.id }
                    livraison.idLimiteDat = { ... new DateLimite(), idLimiteDat: req.body.livraison.idLimiteDat }
                    const date = new Date(req.body.livraison.dateLiv)
                    livraison.dateLiv = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + (date.getUTCDate() + 1);
                    console.log(livraison.dateLiv)
                    const tmp = new Date();
                    const today = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate())
                    livraison.expressLiv = date.getTime() == today.getTime()
                    console.log(livraison.expressLiv)
                    livraison.idTypeCouTypeCoursier = { ... new TypeCoursier(), idTypeCou: req.body.livraison.typeCoursier }
                    await getRepository(Livraison).save(livraison)
                    CustomServer.ioAdmin.emit("plan", livraison.dateLiv)
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