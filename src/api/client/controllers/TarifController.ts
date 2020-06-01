import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Tarif } from "../../../entities/Tarif"
import { Repository, Connection, createConnection } from "typeorm";
import { ormconfig } from "../../../config";
export default class TarifController extends Controller {
    tarifRepository: Repository<Tarif>
    constructor() {
        super()
        this.createConnectionAndAssignRepository()
            .then(async (_) => {
                await this.addAllRoutes(this.mainRouter)
            })
    }


    async createConnectionAndAssignRepository(): Promise<any> {
        let connection: Connection = await createConnection(ormconfig)
        this.tarifRepository = connection.getRepository(Tarif)
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

        return await this.tarifRepository.createQueryBuilder("tarif")
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