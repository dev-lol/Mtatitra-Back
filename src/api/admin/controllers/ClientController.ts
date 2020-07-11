import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Client } from "../../../entities/Client"
import { getRepository } from "typeorm";
import { Livraison } from "../../../entities/Livraison";
import { query } from 'express-validator';
import ErrorValidator from "../../ErrorValidator";
export default class ClientController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }

    async addGet(router: Router): Promise<void> {

        await this.allClient(router)
        await this.statByDate(router)
    }

    allClient = async (router: Router): Promise<void> => {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var data = await getRepository(Client).find()
                this.sendResponse(res, 200, data)
            } catch (error) {
                this.sendResponse(res, 404, { message: "not found" })
            }
        })
    }

    statByDate = async (router: Router): Promise<void> => {
        router.get("/stat", [
            query(['start', 'end']).trim().notEmpty().toDate().isISO8601().withMessage("Bad request"),
            query('limit').optional(true).toInt().isNumeric().withMessage("bad value")
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const startDate: Date = new Date(req.query.start as string)
                const endDate: Date = new Date(req.query.end as string)
                const limit: number = Number(req.query.limit)
                let a = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.idCliClient", "client")
                    .select(`client.idCli as "idCli", client.nomCli as "nomCli" , client.prenomCli as "prenomCli", count(client.idCli) as total`)
                    .where("livraison.dateLiv >= :startDate", { startDate: startDate })
                    .andWhere("livraison.dateLiv <= :endDate", { endDate: endDate })
                    .orderBy("total", "DESC")
                    .limit(req.query.limit ? limit : 10)
                    .groupBy("client.idCli")
                    .getRawMany()
                this.sendResponse(res, 200, a)
            } catch (error) {
                this.sendResponse(res, 404, { message: "not found" })
            }
        })
    }

    async addPost(router: Router): Promise<void> {
        await this.postClient(router)
    }

    async postClient(router: Router) {

    }
    async addPut(router: Router): Promise<void> {

    }

    async addDelete(router: Router): Promise<void> {

    }
}