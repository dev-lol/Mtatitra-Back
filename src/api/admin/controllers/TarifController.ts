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
        await this.postTarif(router)
    }

    async postTarif(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            let tarifToSave: Tarif = await this.createTarifFromRequest(req)
            let tarifSaved: Tarif = await this.saveTarifToDatabase(tarifToSave)

            if (await this.isTarifSaved(tarifSaved)) {
                this.sendResponse(res, 200, { message: "OK" })
            } else {
                this.sendResponse(res, 400, { message: "KO" })
            }

        })
    }

    private async isTarifSaved(tarif: Tarif): Promise<boolean> {
        return tarif !== undefined
    }

    private async createTarifFromRequest(req: Request): Promise<Tarif> {
        let tarif = this.tarifRepository.create(req.body as Object)
        return tarif
    }

    private async saveTarifToDatabase(tarif: Tarif): Promise<Tarif> {
        return await this.tarifRepository.save(tarif)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idTarif", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let tarif: Tarif = await this.tarifRepository.findOneOrFail(Number(req.params.idTarif))
                tarif = this.tarifRepository.merge(tarif, req.body as Object)
                await this.tarifRepository.save(tarif)
                this.sendResponse(res, 200, { message: "Tarif changed" })
            } catch (error) {
                console.log(error)
                this.sendResponse(res, 404, { message: "Tarif not found" })
            }

        })
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idTarif", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let tarif: Tarif = await this.tarifRepository.findOneOrFail(Number(req.params.idTarif))
                await this.tarifRepository.remove(tarif)
                this.sendResponse(res, 203, { message: "Tarif deleted" })
            } catch (error) {
                this.sendResponse(res, 404, { message: "Tarif not found" })
            }

        })
    }
}