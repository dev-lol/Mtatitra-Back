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
                this.sendResponse(res, 404,{message: "not found"})
            }
        })

    }

    private async fetchTarifsFromDatabase(): Promise<Tarif[]> {

        return await getRepository(Tarif).createQueryBuilder("tarif")
            .leftJoinAndSelect("tarif.idTypeCouTypeCoursier", "typeCoursier")
            .leftJoinAndSelect("tarif.idZonZone", "zone")
            .orderBy(`"typeCoursier"."type_cou"`)
            .getMany()
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
        let tarif = getRepository(Tarif).create(req.body as Object)
        return tarif
    }

    private async saveTarifToDatabase(tarif: Tarif): Promise<Tarif> {
        return await getRepository(Tarif).save(tarif)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idTarif", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let tarif: Tarif = await getRepository(Tarif).findOneOrFail(Number(req.params.idTarif))
                tarif = getRepository(Tarif).merge(tarif, req.body as Object)
                await getRepository(Tarif).save(tarif)
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
                let tarif: Tarif = await getRepository(Tarif).findOneOrFail(Number(req.params.idTarif))
                await getRepository(Tarif).remove(tarif)
                this.sendResponse(res, 203, { message: "Tarif deleted" })
            } catch (error) {
                this.sendResponse(res, 404, { message: "Tarif not found" })
            }

        })
    }
}