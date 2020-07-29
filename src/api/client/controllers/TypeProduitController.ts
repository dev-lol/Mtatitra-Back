import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { TypeProduit } from "../../../entities/TypeProduit"
import { getRepository} from "typeorm";

import { runInThisContext } from "vm";
export default class TypeProduitController extends Controller {
    constructor() {
        super()
this.addAllRoutes(this.mainRouter)
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllTypeProduit(router)
    }


    private async getAllTypeProduit(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let typeProduits: TypeProduit[] = await this.fetchTypeProduitsFromDatabase()
                this.sendResponse(res, 200, typeProduits)
            } catch (err) {

            }
        })

    }

    private async fetchTypeProduitsFromDatabase(): Promise<TypeProduit[]> {
        return await getRepository(TypeProduit).find({where: {estSupprime: false}})
    }
    async addPost(router: Router): Promise<void> {
        await this.postTypeProduit(router)
    }

    async postTypeProduit(router: Router) {
    }

    async addPut(router: Router): Promise<void> {
    }

    async addDelete(router: Router): Promise<void> {
    }
}