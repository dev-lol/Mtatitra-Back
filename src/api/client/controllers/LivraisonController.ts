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
            getRepository(Livraison).find({ where: { idCliClient: res.locals.idCli } })
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
                    produit.idTypeProTypeProduit = {...new TypeProduit(), idTypePro: p["typePro"] }
                    produits.push(produit)
                }
                const livraison: Livraison = getRepository(Livraison).create(req.body.livraison as object)
                livraison.produits = produits;
                livraison.idZonArrivee = {... new Zone(), idZon: req.body.livraison.zoneLiv}
                livraison.idCliClient = {... new Client(), idCli: res.locals.id}
                livraison.idLimiteDat = {... new DateLimite(), idLimiteDat: req.body.livraison.dateLimite}
                livraison.expressLiv = new Date(req.body.dateLiv).toDateString() == new Date().toDateString()
                await getRepository(Livraison).save(livraison)
                this.sendResponse(res,200,{message: "livraison inseré"})
            } catch (err) {
                console.log(err)
                this.sendResponse(res,404,{message: err})
            }
        })
    }

    private async createProduitsFromRequest(req: Request): Promise<Produit[]> {

        return req.body.produit
    }
    private async saveLivraisonProduitToDb(pr: Produit[], liv: Livraison): Promise<void> {

        return await pr.forEach(prod => {
            prod.idLivLivraison = liv
            getRepository(Produit).save(prod)
        })

    }
    async addDelete(router: Router) { }
    async addPut(router: Router) { }


}