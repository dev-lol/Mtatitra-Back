import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Coursier } from "../../../entities/Coursier"
import { getRepository } from "typeorm";
import { ormconfig } from "../../../config";
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
        return await getRepository(Coursier).find({ where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {
        await this.postCoursier(router)
    }

    async postCoursier(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            let coursierToSave: Coursier = await this.createCoursierFromRequest(req)


            let coursierSaved: Coursier = await this.saveCoursierToDatabase(coursierToSave)

            if (await this.isCoursierSaved(coursierSaved)) {
                this.sendResponse(res, 200, { message: "OK" })
            } else {
                this.sendResponse(res, 400, { message: "KO" })
            }

        })
    }

    private async isCoursierSaved(coursier: Coursier): Promise<boolean> {
        return coursier !== undefined
    }

    private async createCoursierFromRequest(req: Request): Promise<Coursier> {
        let coursier = getRepository(Coursier).create(req.body as Object)
        let bcrypt = require("bcrypt")
        await bcrypt.hash(coursier.passCou, Number(process.env.SALT), function (err, hash) {
            coursier.passCou = hash
        });
        return coursier
    }

    private async saveCoursierToDatabase(coursier: Coursier): Promise<Coursier> {
        return await getRepository(Coursier).save(coursier)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idCoursier", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let coursier: Coursier = await getRepository(Coursier).findOneOrFail(Number(req.params.idCoursier))
                coursier = getRepository(Coursier).merge(coursier, req.body as Object)
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