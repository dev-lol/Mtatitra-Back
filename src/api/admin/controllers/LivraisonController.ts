import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Admin } from "../../../entities/Admin"
import { getRepository, MoreThan } from "typeorm";
import { ormconfig } from "../../../config";
import { Livraison } from "../../../entities/Livraison";
import { Coursier } from "../../../entities/Coursier";
import ErrorValidator from "../../ErrorValidator";
import { query, param, body } from 'express-validator';
import router from '../../routerApi';
import { Resultat } from '../../../entities/Resultat';
export default class LivraisonController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getLivraison(router)
        await this.livStatByDate(router)
    }

    async livStatByDate(router: Router): Promise<void> {
        router.get("/stat", [
            query(['start', 'end']).notEmpty().toDate().isISO8601().withMessage("Bad request")
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const startDate: Date = new Date(req.query.start as string)
                    const endDate: Date = new Date(req.query.end as string)
                    let a = await getRepository(Livraison)
                        .createQueryBuilder("livraison")
                        .select("livraison.dateLiv,count(livraison.dateLiv)")
                        .where("livraison.dateLiv >= :startDate", { startDate: startDate })
                        .andWhere("livraison.dateLiv <= :endDate", { endDate: endDate })
                        .groupBy("livraison.dateLiv")
                        .getRawMany()
                    this.sendResponse(res, 200, a)
                } catch (error) {
                    console.log(error)
                    this.sendResponse(res, 404, { message: "404 not found" })
                }
            })
    }


    async getLivraison(router: Router): Promise<void> {
        router.get("/", [
            query(['date']).notEmpty().withMessage("Bad request")
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            let liv = []
            const date = new Date(req.query.date as string)
            liv = await getRepository(Livraison)
                .createQueryBuilder("livraison")
                .leftJoinAndSelect("livraison.idCliClient", "client")
                .leftJoinAndSelect("livraison.produits", "produits")
                .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduit")
                .leftJoinAndSelect("livraison.idCouCoursier", "coursier")
                .leftJoinAndSelect("livraison.idTypeCouTypeCoursier", "typeCoursier")
                .leftJoinAndSelect("livraison.idLieDepart", "dep")
                .leftJoinAndSelect("livraison.idLieArrivee", "arr")
                .leftJoinAndSelect("dep.idZonZone", "zonDep")
                .leftJoinAndSelect("arr.idZonZone", "zonArr")
                .leftJoinAndSelect("livraison.idResResultat", "resultat")
                .leftJoinAndSelect("typeCoursier.coursiers", "coursierPossible")
                .where("livraison.dateLiv = :date", { date: date })
                .getMany()
            this.sendResponse(res, 200, liv)
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
                let liv = await getRepository(Livraison).findOneOrFail(req.params.idLivraison)
                liv.rapportLiv = req.body.rapportLiv
                liv.idResResultat = await getRepository(Resultat).findOneOrFail(req.body.idResResultat)
                await getRepository(Livraison).save(liv)
                this.sendResponse(res, 200, { message: "Rapport saved" })
            }
            catch (err) {
                this.sendResponse(res, 400, { message: "Not found" })
            }
        })
    }



    async addPut(router: Router): Promise<void> {
        await this.addCoursierToLivraison(router)
    }

    async addCoursierToLivraison(router: Router): Promise<void> {
        router.patch("/:idLivraison/coursier/:idCoursier", [
            param(['idLivraison', 'idCoursier']).notEmpty().toInt().isNumeric().withMessage("Bad request")
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            try {
                let livraisonToAsign: Livraison = await this.fetchLivraisonToAsign(req)
                let coursier: Coursier = await this.createCoursierFromRequest(req)
                await this.asignCouriserToLivraison(coursier, livraisonToAsign)
                this.sendResponse(res, 200, { message: "Coursier Assigned to Livraison" })
            }
            catch (err) {
                this.sendResponse(res, 400, { message: "Erreur" })
            }
        })
    }

    private async asignCouriserToLivraison(cou: Coursier, liv: Livraison): Promise<Livraison> {
        liv.idCouCoursier = cou
        return await getRepository(Livraison).save(liv)
    }

    private async fetchLivraisonToAsign(req: Request): Promise<Livraison> {
        return await getRepository(Livraison).findOne(req.params.idLivraison)
    }

    private async createCoursierFromRequest(req: Request): Promise<Coursier> {
        return { ...new Coursier(), idCou: Number(req.params.idCoursier) }
    }

    async addDelete(router: Router): Promise<void> {

    }
}