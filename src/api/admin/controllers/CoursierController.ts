import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Coursier } from "../../../entities/Coursier"
import { getRepository } from "typeorm";

import { TypeCoursier } from "../../../entities/TypeCoursier";
import Password from '../../../utils/Password';
import { Livraison } from "../../../entities/Livraison";
import ErrorValidator from "../../ErrorValidator";
import { query, body } from 'express-validator';
export default class CoursierController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllCoursier(router)
        await this.statByDate(router)
        await this.planningByDate(router)
    }

    private async planningByDate(router: Router): Promise<void> {
        router.get("/plan", async (req: Request, res: Response, next: NextFunction) => {
            try {
                const date = new Date(req.query.date as string)

                let planning: Livraison[] = await getRepository(Livraison)
                    .find({ relations: ["idCouCoursier", "idLieDepart", "idLieArrivee", "idLimiteDat", "idTypeCouTypeCoursier"], where: { dateLiv: date } })

                let countLivDay: number = await getRepository(Livraison).count({ where: { dateLiv: date } })

                this.sendResponse(res, 200, { planning, countLivDay })
            } catch (err) {
                console.log(err)
                this.sendResponse(res,404,{message: "Not found"})
            }
        })
    }


    private async getAllCoursier(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let coursiers: Coursier[] = await this.fetchCoursiersFromDatabase()

                this.sendResponse(res, 200, coursiers)
            } catch (err) {

            }
        })

    }

    private async statByDate(router: Router): Promise<void> {
        router.get("/stat", [
            query(['start', 'end']).notEmpty().toDate().isISO8601().withMessage("Bad request"),
            query('limit').optional(true).toInt().isNumeric().withMessage("bad value")
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const startDate: Date = new Date(req.query.start as string)
                const endDate: Date = new Date(req.query.end as string)
                const limit: number = Number(req.query.limit)
                let a = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.idCouCoursier", "coursier")
                    .select(`coursier.nomCou as 'nomCou' ,coursier.prenomCou as 'prenomCour', coursier.idCou as 'idCou' , count(coursier.idCou) as total`)
                    .where("livraison.dateLiv >= :startDate", { startDate: startDate })
                    .andWhere("livraison.dateLiv <= :endDate", { endDate: endDate })
                    .orderBy("total", "DESC")
                    .limit(req.query.limit ? limit : 10)
                    .groupBy("coursier.idCou")
                    .getRawMany()

                this.sendResponse(res, 200, a)
            } catch (err) {

            }
        })
    }

    private async fetchCoursiersFromDatabase(): Promise<Coursier[]> {
        return await getRepository(Coursier).find({ relations: ["idTypeCouTypeCoursier"], where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {
        await this.postCoursier(router)
    }

    async postCoursier(router: Router) {
        router.post("/", [
            body(['nomCou', 'prenomCou', 'numTelCou', 'numTelUrgentCou', 'adresseCou', 'referenceVehiculeCou', 'usernameCou', 'passCou', 'idTypeCouTypeCoursier']).notEmpty().withMessage("Champs vide"),
            body(['numTelCou', 'numTelUrgentCou']).matches(/^3[2-49]\d{7}$/).withMessage("Numero telephone incorrecte"),
            body('usernameCou').trim().custom(async (value) => {
                const count = await getRepository(Coursier).count({ where: { usernameCou: value } })
                if (count > 0) {
                    throw "Nom d'utilisateur déjà pris"
                } else {
                    return true;
                }
            })
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const coursierToSave: Coursier = await getRepository(Coursier).create(req.body as Object)
                    coursierToSave.passCou = await Password.hash(coursierToSave.passCou)
                    coursierToSave.idTypeCouTypeCoursier = await getRepository(TypeCoursier).findOneOrFail(req.body.idTypeCouTypeCoursier)
                    await getRepository(Coursier).save(coursierToSave)
                    this.sendResponse(res, 201, { message: "Coursier added" })
                } catch (error) {
                    this.sendResponse(res, 400, { message: "KO" })
                }
            })
    }

    async addPut(router: Router): Promise<void> {
        router.put("/:idCoursier", [
            body(['nomCou', 'prenomCou', 'numTelCou', 'numTelUrgentCou', 'adresseCou', 'referenceVehiculeCou', 'usernameCou', 'idTypeCouTypeCoursier']).notEmpty().withMessage("Champs vide"),
            body(['numTelCou', 'numTelUrgentCou']).matches(/^3[2-49]\d{7}$/).withMessage("Numero telephone incorrecte"),
            body('passCou').optional(true)
        ],
            ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let coursierOriginal: Coursier = await getRepository(Coursier).findOneOrFail(Number(req.params.idCoursier), { relations: ["idTypeCouTypeCoursier"] })
                    let coursier = getRepository(Coursier).merge(coursierOriginal, req.body as Object)
                    if (req.body.passCou) {
                        coursier.passCou = await Password.hash(coursier.passCou)
                    }
                    if (req.body.idTypeCouTypeCoursier != coursierOriginal.idTypeCouTypeCoursier.idTypeCou) {
                        coursier.idTypeCouTypeCoursier = await getRepository(TypeCoursier).findOneOrFail(req.body.idTypeCouTypeCoursier)
                    }
                    await getRepository(Coursier).save(coursier)
                    this.sendResponse(res, 200, { message: "Coursier changed" })
                } catch (error) {
                    console.log(error)
                    this.sendResponse(res, 404, { message: "Coursier not found" })
                }

            })
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idCoursier", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let coursier: Coursier = await getRepository(Coursier).findOneOrFail(Number(req.params.idCoursier))
                await getRepository(Coursier).remove(coursier)
                this.sendResponse(res, 203, { message: "Coursier deleted" })
            } catch (error) {
                this.sendResponse(res, 404, { message: "Coursier not found" })
            }

        })
    }
}