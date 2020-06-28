import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Etats } from "../../../entities/Etats"
import { Repository, Connection, createConnection, getConnection } from "typeorm";
import { ormconfig } from "../../../config";
import { runInThisContext } from "vm";
import { json } from "body-parser";
export default class EtatsController extends Controller {
    etatsRepository: Repository<Etats>
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllEtats(router)
    }


    private async getAllEtats(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let etatss: Etats[] = await this.fetchEtatssFromDatabase()

                this.sendResponse(res, 200, { data: etatss })
            } catch (err) {

            }
        })

    }

    private async fetchEtatssFromDatabase(): Promise<Etats[]> {
        return await this.etatsRepository.find({ where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {
        await this.postEtats(router)
    }

    async postEtats(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            let etatsToSave: Etats = await this.createEtatsFromRequest(req)


            let etatsSaved: Etats = await this.saveEtatsToDatabase(etatsToSave)

            if (await this.isEtatsSaved(etatsSaved)) {
                this.sendResponse(res, 200, { message: "OK" })
            } else {
                this.sendResponse(res, 400, { message: "KO" })
            }

        })
    }

    private async isEtatsSaved(etats: Etats): Promise<boolean> {
        return etats !== undefined
    }

    private async createEtatsFromRequest(req: Request): Promise<Etats> {
        let etats = this.etatsRepository.create(req.body as Object)
        return etats
    }

    private async saveEtatsToDatabase(etats: Etats): Promise<Etats> {
        return await this.etatsRepository.save(etats)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idEtats", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let etats: Etats = await this.etatsRepository.findOneOrFail(Number(req.params.idEtats))
                etats = this.etatsRepository.merge(etats, req.body as Object)
                await this.etatsRepository.save(etats)
                this.sendResponse(res, 200, { message: "Etats changed" })
            } catch (error) {
                console.log(error)
                this.sendResponse(res, 404, { message: "Etats not found" })
            }

        })

        this.patchOrdre(router);
    }
    /**
     *
     *
     * @private
     * @param {Router} router
     * @memberof EtatsController
     * 
     * donnee entree:
     * 
     * ordre = {idEta: ordre} 
     * exemple: {1:3, 2:4}
     * 
     */
    private patchOrdre(router: Router) {
        router.patch("/ordre", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var ordre: Object = JSON.parse(req.body.ordre)
                let count = await this.etatsRepository.count()
                if (Object.keys(ordre).length != count || (new Set(Object.values(ordre))).size != count)
                    throw new Error("Ordre dupliquee ou manquante")
                var etats = await this.etatsRepository.find()
                for (let etat of etats) {
                    etat.ordreEta = ordre[etat.idEta]
                }
                await this.etatsRepository.save(etats);
                this.sendResponse(res, 200, { message: "Ordre changed" });
            }
            catch (error) {
                console.log(error);
                this.sendResponse(res, 404, { message: "Ordre not changed" });
            }
        });
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idEtats", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let etats: Etats = await this.etatsRepository.findOneOrFail(Number(req.params.idEtats))
                await this.etatsRepository.remove(etats)
                this.sendResponse(res, 203, { message: "Etats deleted" })
            } catch (error) {
                this.sendResponse(res, 404, { message: "Etats not found" })
            }

        })
    }
}