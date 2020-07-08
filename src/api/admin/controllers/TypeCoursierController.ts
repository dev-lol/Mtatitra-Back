import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { TypeCoursier } from "../../../entities/TypeCoursier"
import { getRepository } from "typeorm";
import { ormconfig } from "../../../config";
import { runInThisContext } from "vm";
import { Livraison } from "../../../entities/Livraison";
import ErrorValidator from "../../ErrorValidator";
import { query, sanitizeQuery, body, param } from "express-validator";
export default class TypeCoursierController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllTypeCoursier(router)
        await this.statByCoursier(router)
        await this.planning(router)
    }


    private async getAllTypeCoursier(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let typeCoursiers: TypeCoursier[] = await this.fetchTypeCoursiersFromDatabase()

                this.sendResponse(res, 200, { data: typeCoursiers })
            } catch (err) {

            }
        })

    }

    private async statByCoursier(router: Router): Promise<void> {
        router.get("/stat", [
            query(['start', 'end']).notEmpty().toDate().isISO8601().toDate().withMessage("invalid start or end"),
            query(['limit']).optional(true).isInt().withMessage("limit error")
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const startDate: Date = new Date(req.query.start as string)
                    const endDate: Date = new Date(req.query.end as string)
                    const limit: number = Number(req.query.limit)
                    let a = await getRepository(Livraison)
                        .createQueryBuilder("livraison")
                        .leftJoinAndSelect("livraison.idTypeCouTypeCoursier", "typeCoursier")
                        .select(`typeCoursier.typeCou as "typeCou"`)
                        .addSelect(`typeCoursier.idTypeCou as "idTypeCou"`)
                        .addSelect(`count(typeCoursier.idTypeCou) as total`)
                        .where("livraison.dateLiv >= :startDate", { startDate: startDate })
                        .andWhere("livraison.dateLiv <= :endDate", { endDate: endDate })
                        .orderBy("total", "DESC")
                        .limit(req.query.limit ? limit : 10)
                        .groupBy("typeCoursier.idTypeCou")
                        .getRawMany()

                    this.sendResponse(res, 200, a)
                } catch (err) {
                    console.log(err)
                    this.sendResponse(res, 404, { message: "not found" })
                }
            })
    }
    private async planning(router): Promise<void> {
        router.get("/planning", async (req: Request, res: Response, next: NextFunction) => {
            const date: Date = new Date(req.query.date as string)
            const id: number = Number(req.params.idTypeCou)
            try {
                let plan = await getRepository(TypeCoursier)
                    .createQueryBuilder("type")
                    .leftJoinAndSelect("type.livraisons", "livraison")
                    .innerJoinAndSelect("livraison.idCliClient", "client")
                    .innerJoinAndSelect("livraison.idCouCoursier", "coursier")
                    .leftJoinAndSelect("livraison.idLimiteDat", "limiteDat")
                    .leftJoinAndSelect("livraison.idLieDepart", "lieuDepart")
                    .leftJoinAndSelect("lieuDepart.idZonZone", "zoneDepart")
                    .leftJoinAndSelect("livraison.idLieArrivee", "lieuArrivee")
                    .leftJoinAndSelect("lieuArrivee.idZonZone", "zoneArrivee")
                    .andWhere("livraison.dateLiv = :date", { date: date })
                    .getMany()

                this.sendResponse(res, 200, plan)
            } catch (err) {
                next(err)
            }

        })
    }

    private async fetchTypeCoursiersFromDatabase(): Promise<TypeCoursier[]> {
        return await getRepository(TypeCoursier).find({ where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {
        await this.postTypeCoursier(router)
    }

    async postTypeCoursier(router: Router) {
        router.post("/", [
            body(['typeCou']).notEmpty().withMessage("Bad request")
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                let typeCoursierToSave: TypeCoursier = await this.createTypeCoursierFromRequest(req)

                typeCoursierToSave.estSupprime = false
                let typeCoursierSaved: TypeCoursier = await this.saveTypeCoursierToDatabase(typeCoursierToSave)

                if (await this.isTypeCoursierSaved(typeCoursierSaved)) {
                    this.sendResponse(res, 200, { message: "OK" })
                } else {
                    this.sendResponse(res, 400, { message: "KO" })
                }

            })
    }

    private async isTypeCoursierSaved(typeCoursier: TypeCoursier): Promise<boolean> {
        return typeCoursier !== undefined
    }

    private async createTypeCoursierFromRequest(req: Request): Promise<TypeCoursier> {
        let type = getRepository(TypeCoursier).create(req.body as Object)
        return type
    }

    private async saveTypeCoursierToDatabase(typeCoursier: TypeCoursier): Promise<TypeCoursier> {
        return await getRepository(TypeCoursier).save(typeCoursier)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idType", [
            param('idType').notEmpty().toInt().isNumeric().withMessage("bad request"),
            body(['typeCou']).notEmpty().withMessage("Bad request")
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            try {
                let type: TypeCoursier = await getRepository(TypeCoursier).findOneOrFail(Number(req.params.idType))
                type = getRepository(TypeCoursier).merge(type, req.body as Object)
                type.estSupprime = false
                await getRepository(TypeCoursier).save(type)
                this.sendResponse(res, 200, { message: "Type changed" })
            } catch (error) {
                console.log(error)
                this.sendResponse(res, 404, { message: "Type not found" })
            }

        })
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idType", [
            param('idType').notEmpty().toInt().isNumeric().withMessage("bad request"),
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let type: TypeCoursier = await getRepository(TypeCoursier).findOneOrFail(Number(req.params.idType))
                    type.estSupprime = true
                    await getRepository(TypeCoursier).save(type)
                    this.sendResponse(res, 203, { message: "Type deleted" })
                } catch (error) {
                    this.sendResponse(res, 404, { message: "Type not found" })
                }

            })
    }
}