import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { TypeLivraison } from "../../../entities/TypeLivraison"
import { getRepository} from "typeorm";
import { ormconfig } from "../../../config";
import { runInThisContext } from "vm";
export default class TypeLivraisonController extends Controller {
    constructor() {
        super()
this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllTypeLivraison(router)
    }


    private async getAllTypeLivraison(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let typeLivraisons: TypeLivraison[] = await this.fetchTypeLivraisonsFromDatabase()

                this.sendResponse(res, 200, { data: typeLivraisons })
            } catch (err) {

            }
        })

    }

    private async fetchTypeLivraisonsFromDatabase(): Promise<TypeLivraison[]> {
        return await getRepository(TypeLivraison).find({where: {estSupprime: false}})
    }
    async addPost(router: Router): Promise<void> {
        await this.postTypeLivraison(router)
    }

    async postTypeLivraison(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            let typeLivraisonToSave: TypeLivraison = await this.createTypeLivraisonFromRequest(req)

            typeLivraisonToSave.estSupprime = false
            let typeLivraisonSaved: TypeLivraison = await this.saveTypeLivraisonToDatabase(typeLivraisonToSave)

            if (await this.isTypeLivraisonSaved(typeLivraisonSaved)) {
                this.sendResponse(res,200,{message: "OK"})
            } else {
                this.sendResponse(res,400,{message: "KO"})
            }

        })
    }

    private async isTypeLivraisonSaved(typeLivraison: TypeLivraison): Promise<boolean> {
        return typeLivraison !== undefined
    }

    private async createTypeLivraisonFromRequest(req: Request): Promise<TypeLivraison> {
        let type = getRepository(TypeLivraison).create(req.body as Object)
        type.estSupprime = false
        return type
    }

    private async saveTypeLivraisonToDatabase(typeLivraison: TypeLivraison): Promise<TypeLivraison> {
        return await getRepository(TypeLivraison).save(typeLivraison)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idType",async (req: Request, res: Response, next: NextFunction) => {
            try {
                let type: TypeLivraison = await getRepository(TypeLivraison).findOneOrFail(Number(req.params.idType))
                type = getRepository(TypeLivraison).merge(type, req.body as Object)
                type.estSupprime = false
                await getRepository(TypeLivraison).save(type)
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
                let type: TypeLivraison = await getRepository(TypeLivraison).findOneOrFail(Number(req.params.idType))
                type.estSupprime = false
                await getRepository(TypeLivraison).save(type)
                this.sendResponse(res,203, {message: "Type deleted"})
            } catch (error) {
                this.sendResponse(res,404, {message: "Type not found"})   
            }
                
        })
    }
}