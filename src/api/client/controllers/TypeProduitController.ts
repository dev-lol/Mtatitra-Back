import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { TypeProduit } from "../../../entities/TypeProduit"
import { Repository, Connection, createConnection } from "typeorm";
import { ormconfig } from "../../../config";
import { runInThisContext } from "vm";
export default class TypeProduitController extends Controller {
    typeProduitRepository: Repository<TypeProduit>
    constructor() {
        super()
        this.createConnectionAndAssignRepository()
            .then(async (_) => {
                await this.addAllRoutes(this.mainRouter)
            })
    }


    async createConnectionAndAssignRepository(): Promise<any> {
        let connection: Connection = await createConnection(ormconfig)
        this.typeProduitRepository = connection.getRepository(TypeProduit)
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
        return await this.typeProduitRepository.find({where: {estSupprime: false}})
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