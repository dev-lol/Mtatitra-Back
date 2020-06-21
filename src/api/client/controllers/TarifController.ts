import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Tarif } from "../../../entities/Tarif"
import { getRepository } from "typeorm";
import { ormconfig } from "../../../config";
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

                let tarifs: Tarif[] = await this.fetchTarifsFromDatabase()

                this.sendResponse(res, 200, { data: tarifs })
            } catch (err) {

            }
        })

    }

    private async fetchTarifsFromDatabase(): Promise<Tarif[]> {

        return await getRepository(Tarif).createQueryBuilder("tarif")
            .leftJoinAndSelect("tarif.idTypeCouTypeCoursier", "typeCoursier")
            .orderBy("typeCoursier.typeCoursier").getMany()
    }
    async addPost(router: Router): Promise<void> {
    }
    async addPut(router: Router): Promise<void> {

    }

    async addDelete(router: Router): Promise<void> {

    }
}