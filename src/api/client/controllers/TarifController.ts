import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Tarif } from "../../../entities/Tarif"
import { getRepository } from "typeorm";
import { ormconfig } from "../../../config";
import { TypeCoursier } from '../../../entities/TypeCoursier';
export default class TarifController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllTarif(router)
    }


    private async getAllTarif(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let tarifs = await this.fetchTarifsFromDatabase()

                this.sendResponse(res, 200, tarifs)
            } catch (err) {
                console.log(err)
                this.sendResponse(res, 404, { message: "Tarif not found" })

            }
        })

    }

    private async fetchTarifsFromDatabase(): Promise<any[]> {

        // return await getRepository(Tarif)
        //     .createQueryBuilder("tarif")
        //     .leftJoinAndSelect("tarif.idTypeCouTypeCoursier", "typeCoursier")
        //     .leftJoinAndSelect("tarif.idZonZone", "zone")
        //     .orderBy("typeCoursier.idTypeCou")
        //     .where("zone.est_supprime = false")
        //     .andWhere(`"typeCoursier".est_supprime = false`)
        //     .getMany()
        return await getRepository(TypeCoursier)
        .createQueryBuilder("typeCoursier")
        // .relation()
        .leftJoinAndSelect("typeCoursier.tarifs","tarif")
        .getMany()
    }
    async addPost(router: Router): Promise<void> {
    }
    async addPut(router: Router): Promise<void> {

    }

    async addDelete(router: Router): Promise<void> {

    }
}