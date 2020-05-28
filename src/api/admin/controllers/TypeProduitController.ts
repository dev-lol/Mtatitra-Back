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

                this.sendResponse(res, 200, { data: typeProduits })
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
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            let typeProduitToSave: TypeProduit = await this.createTypeProduitFromRequest(req)


            let typeProduitSaved: TypeProduit = await this.saveTypeProduitToDatabase(typeProduitToSave)

            if (await this.isTypeProduitSaved(typeProduitSaved)) {
                this.sendResponse(res,200,{message: "OK"})
            } else {
                this.sendResponse(res,400,{message: "KO"})
            }

        })
    }

    private async isTypeProduitSaved(typeProduit: TypeProduit): Promise<boolean> {
        return typeProduit !== undefined
    }

    private async createTypeProduitFromRequest(req: Request): Promise<TypeProduit> {
        let type = this.typeProduitRepository.create(req.body as Object)
        return type
    }

    private async saveTypeProduitToDatabase(typeProduit: TypeProduit): Promise<TypeProduit> {
        return await this.typeProduitRepository.save(typeProduit)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idType",async (req: Request, res: Response, next: NextFunction) => {
            try {
                let type: TypeProduit = await this.typeProduitRepository.findOneOrFail(Number(req.params.idType))
                type = this.typeProduitRepository.merge(type, req.body as Object)
                await this.typeProduitRepository.save(type)
                this.sendResponse(res,200, {message: "Type changed"})
            } catch (error) {
                console.log(error)
                this.sendResponse(res,404, {message: "Type not found"})   
            }
                
        })
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idType", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let type: TypeProduit = await this.typeProduitRepository.findOneOrFail(Number(req.params.idType))
                await this.typeProduitRepository.remove(type)
                this.sendResponse(res,203, {message: "Type deleted"})
            } catch (error) {
                this.sendResponse(res,404, {message: "Type not found"})   
            }
                
        })
    }
}