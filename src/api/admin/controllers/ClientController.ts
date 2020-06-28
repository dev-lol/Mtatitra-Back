import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Client } from "../../../entities/Client"
import { getRepository } from "typeorm";
export default class ClientController extends Controller {
    constructor() {
        super()
    this.addAllRoutes(this.mainRouter)
    }

    async addGet(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var data = await getRepository(Client).find()
                this.sendResponse(res, 200, data)
            } catch (error) {
                this.sendResponse(res, 404, {message: "not found"})
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