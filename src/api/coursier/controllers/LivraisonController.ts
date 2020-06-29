import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Coursier } from "../../../entities/Coursier"
import { getRepository, Connection, createConnection, getConnection, MoreThan } from "typeorm";
import { ormconfig } from "../../../config";
import { Livraison } from "../../../entities/Livraison";
import { Etats } from "../../../entities/Etats";
import { CustomServer } from '../../Server';
import jwt from 'jsonwebtoken';
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
                    .leftJoinAndSelect("livraison.idZonDepart", "zoneDepart")
                    .leftJoinAndSelect("livraison.idZonArrivee", "zoneArrivee")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduits")
                    .where("livraison.idCouCoursier = :id", { id: res.locals.id })
                    .andWhere("livraison.dateLiv > CURRENT_DATE  ")
                    .andWhere("livraison.dateLiv < CURRENT_DATE +2 ")
                    .getMany()

                this.sendResponse(res, 200, tomorrowLiv)
            } catch (err) {

            }
        })
    }
    async todayLivraison(router: Router): Promise<void> {
        router.get("/aujourdhui", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let todayLiv: Livraison[] = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.idCliClient", "client")
                    .leftJoinAndSelect("livraison.idLimiteDat", "limiteDat")
                    .leftJoinAndSelect("livraison.idEtaEtats", "etat")
                    .leftJoinAndSelect("livraison.idZonDepart", "zoneDepart")
                    .leftJoinAndSelect("livraison.idZonArrivee", "zoneArrivee")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduits")
                    .where("livraison.idCouCoursier = :id", { id: res.locals.id })
                    .andWhere("livraison.dateLiv >= CURRENT_DATE  ")
                    .andWhere("livraison.dateLiv < CURRENT_DATE +1 ")
                    .getMany()

                this.sendResponse(res, 200, todayLiv)
            } catch (err) {
                this.sendResponse(res, 404, err)
            }
        })
    }
    async addPost(router: Router): Promise<void> {

    }



    async addPut(router: Router): Promise<void> {
        await this.patchEtat(router)
    }

    async patchEtat(router): Promise<void> {
        router.patch("/:idLivraison", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let livraisonToUpdate: Livraison = await this.fetchLivraisonToUpdateFromDb(req)
                if (req.body.idEtat) {

                    livraisonToUpdate.idEtaEtats = await getRepository(Etats).findOneOrFail(req.body.idEta)
                    let livraison = await getRepository(Livraison).save(livraisonToUpdate)
                    this.sendResponse(res, 200, {
                        message: "Etat changed"
                    })
                    const liv: Livraison = await getRepository(Livraison).createQueryBuilder("livraison").leftJoinAndSelect("livraison.idCliClient", "client").where("livraison.idLiv = :id", { id: livraison.idLiv }).getOne()
                    CustomServer.io.to(liv.idCliClient.idCli).emit("etats", livraisonToUpdate)
                }else{
                    this.sendResponse(res,400, {message: "Requette manquante"})
                }
            } catch (e) {
                console.log(e)
            }
        })
        router.patch("/:idLivraison/commencer", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let livraisonToUpdate: Livraison = await this.fetchLivraisonToUpdateFromDb(req)
                livraisonToUpdate.idEtaEtats = await getRepository(Etats).findOneOrFail({ where: { ordreEta: 0 } })
                let livraison = await getRepository(Livraison).save(livraisonToUpdate)
                this.sendResponse(res, 200, {
                    message: "Etat changed"
                })
                const liv: Livraison = await getRepository(Livraison).createQueryBuilder("livraison").leftJoinAndSelect("livraison.idCliClient", "client").where("livraison.idLiv = :id", { id: livraison.idLiv }).getOne()
                CustomServer.io.to(liv.idCliClient.idCli).emit("etats", livraisonToUpdate)
            } catch (e) {
                console.log(e)
            }
        })
    }

    private async fetchLivraisonToUpdateFromDb(req: Request): Promise<Livraison> {
        return await getRepository(Livraison).findOneOrFail(req.params.idLivraison)
    }


    async addDelete(router: Router): Promise<void> {

    }
}