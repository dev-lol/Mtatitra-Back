import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { TypeCoursier } from "../../../entities/TypeCoursier"
import { Repository, Connection, createConnection } from "typeorm";
import { ormconfig } from "../../../config";
import { runInThisContext } from "vm";
export default class TypeCoursierController extends Controller {
    typeCoursierRepository: Repository<TypeCoursier>
    constructor() {
        super()
        this.createConnectionAndAssignRepository()
            .then(async (_) => {
                await this.addAllRoutes(this.mainRouter)
            })
    }


    async createConnectionAndAssignRepository(): Promise<any> {
        let connection: Connection = await createConnection(ormconfig)
        this.typeCoursierRepository = connection.getRepository(TypeCoursier)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllTypeCoursier(router)
    }


    private async getAllTypeCoursier(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let typeCoursiers: TypeCoursier[] = await this.fetchTypeCoursiersFromDatabase()

                this.sendResponse(res, 200, { data: typeCoursiers })
            } catch (err) {

            }
        })

    }

    private async fetchTypeCoursiersFromDatabase(): Promise<TypeCoursier[]> {
        return await this.typeCoursierRepository.find({ where: { estSupprime: false } })
    }
    async addPost(router: Router): Promise<void> {

    }


    async addPut(router: Router): Promise<void> {

    }

    async addDelete(router: Router): Promise<void> {

    }
}