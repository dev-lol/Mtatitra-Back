import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { getRepository } from "typeorm";
import ErrorValidator from "../../ErrorValidator";
import { query, sanitizeQuery, check, body, param } from "express-validator";
import { Resultat } from '../../../entities/Resultat';
export default class ResultatController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllResultat(router)
        await this.statByResultat(router)
    }


    private async getAllResultat(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let resultats: Resultat[] = await this.fetchResultatsFromDatabase()

                this.sendResponse(res, 200, resultats)
            } catch (err) {
                this.sendResponse(res, 404, { message: "not found" })
            }
        })

    }


    private async statByResultat(router: Router): Promise<void> {
        router.get("/stat", [
            query(['start', 'end']).notEmpty().toDate().isISO8601().toDate().withMessage("invalid start or end")
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const startDate: Date = new Date(req.query.start as string)
                    const endDate: Date = new Date(req.query.end as string)
                    let a = await getRepository(Resultat)
                        .createQueryBuilder("resultat")
                        .leftJoinAndSelect("resultat.lieu", "lieu")
                        .leftJoinAndSelect("lieu.livraisons2", "livraison", "livraison.dateLiv >= :startDate AND livraison.dateLiv <= :endDate", { startDate: startDate, endDate: endDate })
                        .select(`resultat.nomZon as "nomZon"`)
                        .addSelect(`resultat.idZon as "idZon"`)
                        .addSelect(`count(livraison) as total`)
                        .groupBy("resultat.idZon")
                        .orderBy("total", "DESC")
                        .addOrderBy("resultat.idZon", "ASC")
                        .getRawMany()
                    this.sendResponse(res, 200, a)
                } catch (err) {
                    console.log(err)
                    this.sendResponse(res, 404, { message: "not found" })

                }
            })
    }


    private async fetchResultatsFromDatabase(): Promise<Resultat[]> {
        return await getRepository(Resultat).find({ where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {
        await this.postResultat(router)
    }

    async postResultat(router: Router) {
        router.post("/", [
            body(['nomZon']).notEmpty().withMessage("Champs vide"),
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                let resultatToSave: Resultat = await this.createResultatFromRequest(req)

                resultatToSave.estSupprime = false
                let resultatSaved: Resultat = await this.saveResultatToDatabase(resultatToSave)

                if (await this.isResultatSaved(resultatSaved)) {
                    this.sendResponse(res, 200, { message: "OK" })
                } else {
                    this.sendResponse(res, 400, { message: "KO" })
                }

            })
    }

    private async isResultatSaved(resultat: Resultat): Promise<boolean> {
        return resultat !== undefined
    }

    private async createResultatFromRequest(req: Request): Promise<Resultat> {
        let resultat = getRepository(Resultat).create(req.body as Object)
        return resultat
    }

    private async saveResultatToDatabase(resultat: Resultat): Promise<Resultat> {
        return await getRepository(Resultat).save(resultat)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idResultat", [
            body(['nomZon']).notEmpty().withMessage("Champs vide"),
            param('idResultat').notEmpty().toInt().isNumeric().withMessage("bad request")
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let resultat: Resultat = await getRepository(Resultat).findOneOrFail(Number(req.params.idResultat))
                    resultat = getRepository(Resultat).merge(resultat, req.body as Object)
                    resultat.estSupprime = false
                    await getRepository(Resultat).save(resultat)
                    this.sendResponse(res, 200, { message: "Resultat changed" })
                } catch (error) {
                    console.log(error)
                    this.sendResponse(res, 404, { message: "Resultat not found" })
                }

            })
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idResultat", [
            param('idResultat').notEmpty().toInt().isNumeric().withMessage("bad request")
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let resultat: Resultat = await getRepository(Resultat).findOneOrFail(Number(req.params.idResultat))
                    resultat.estSupprime = true
                    await getRepository(Resultat).save(resultat)
                    this.sendResponse(res, 203, { message: "Resultat deleted" })
                } catch (error) {
                    this.sendResponse(res, 404, { message: "Resultat not found" })
                }

            })
    }
}