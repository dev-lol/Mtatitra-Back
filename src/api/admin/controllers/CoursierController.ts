import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Coursier } from "../../../entities/Coursier"
import { getRepository } from "typeorm";
import { ormconfig } from "../../../config";
import { TypeCoursier } from "../../../entities/TypeCoursier";
import Password from '../../../utils/Password';
export default class CoursierController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllCoursier(router)
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

    private async fetchCoursiersFromDatabase(): Promise<Coursier[]> {
        return await getRepository(Coursier).find({ relations: ["idTypeCouTypeCoursier"], where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {
        await this.postCoursier(router)
    }

    async postCoursier(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                const coursierToSave: Coursier = await getRepository(Coursier).create(req.body as Object)
                coursierToSave.passCou = await Password.hash(coursierToSave.passCou)
                coursierToSave.idTypeCouTypeCoursier = await getRepository(TypeCoursier).findOneOrFail(req.body.idTypeCou)
                await getRepository(Coursier).save(coursierToSave)
                this.sendResponse(res, 201, { message: "Coursier added" })
            } catch (error) {
                this.sendResponse(res, 400, { message: "KO" })
            }
        })
    }

    async addPut(router: Router): Promise<void> {
        router.put("/:idCoursier", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let coursierOriginal: Coursier = await getRepository(Coursier).findOneOrFail(Number(req.params.idCoursier), { relations: ["idTypeCouTypeCoursier"] })
                let coursier = getRepository(Coursier).merge(coursierOriginal, req.body as Object)
                if (req.body.passCou) {
                    coursier.passCou = await Password.hash(coursier.passCou)
                }
                if (req.body.idTypeCou != coursierOriginal.idTypeCouTypeCoursier.idTypeCou) {
                    coursier.idTypeCouTypeCoursier = await getRepository(TypeCoursier).findOneOrFail(req.body.idTypeCou)
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