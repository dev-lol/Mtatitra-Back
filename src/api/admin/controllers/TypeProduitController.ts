import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { TypeProduit } from "../../../entities/TypeProduit"
import { getRepository, Connection, createConnection, getConnection } from "typeorm";
import { ormconfig } from "../../../config";
import { runInThisContext } from "vm";
import { Livraison } from "../../../entities/Livraison";
import { Produit } from "../../../entities/Produit";
export default class TypeProduitController extends Controller {
    constructor() {
        super()
this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllTypeProduit(router)
        await this.statByType(router)
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

    private async statByType(router :Router) : Promise<void>{
        router.get("/stat",async(req:Request,res:Response,next:NextFunction)=>{
            try{
                const startDate: Date = new Date(req.query.start as string)
                const endDate: Date = new Date(req.query.end as string)
                const limit: number = Number(req.query.limit)
                
                
                let a =await  getRepository(Produit)
                    .createQueryBuilder("produit")
                    .leftJoinAndSelect("produit.idTypeProTypeProduit","type")
                    .leftJoinAndSelect("produit.idLivLivraison","livraison")
                    .select(`type.idTypePro as "idTypePro" ,count(type.idTypePro) as total `)
                    .where("livraison.dateLiv > :date1",{date1  : startDate})
                    .andWhere("livraison.dateLiv <:date2",{date2 : endDate})
                    .groupBy("type.idTypePro")
                    .limit(req.query.limit ? limit : 10)
                    .getRawMany()
                
                   this.sendResponse(res,200,a)
                    
            }catch(err){
                
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
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            let typeProduitToSave: TypeProduit = await this.createTypeProduitFromRequest(req)

            typeProduitToSave.estSupprime = false
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
        let type = getRepository(TypeProduit).create(req.body as Object)
        return type
    }

    private async saveTypeProduitToDatabase(typeProduit: TypeProduit): Promise<TypeProduit> {
        return await getRepository(TypeProduit).save(typeProduit)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idType",async (req: Request, res: Response, next: NextFunction) => {
            try {
                let type: TypeProduit = await getRepository(TypeProduit).findOneOrFail(Number(req.params.idType))
                type = getRepository(TypeProduit).merge(type, req.body as Object)
                type.estSupprime = false
                await getRepository(TypeProduit).save(type)
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
                let type: TypeProduit = await getRepository(TypeProduit).findOneOrFail(Number(req.params.idType))
                type.estSupprime = true
                await getRepository(TypeProduit).save(type)
                this.sendResponse(res,203, {message: "Type deleted"})
            } catch (error) {
                this.sendResponse(res,404, {message: "Type not found"})   
            }
                
        })
    }
}