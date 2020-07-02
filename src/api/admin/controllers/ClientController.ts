import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Client } from "../../../entities/Client"
import { getRepository } from "typeorm";
import { Livraison } from "../../../entities/Livraison";
export default class ClientController extends Controller {
    constructor() {
        super()
    this.addAllRoutes(this.mainRouter)
    }

    async addGet(router: Router): Promise<void> {
        
       //await this.allClient(router)
       await this.statByDate(router)
    }

    allClient = async(router : Router) : Promise<void>=>{
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var data = await getRepository(Client).find()
                this.sendResponse(res, 200, data)
            } catch (error) {
                this.sendResponse(res, 404, {message: "not found"})
            }
        })
    }   

    statByDate = async(router : Router) : Promise<void>=>{
        router.get("/stat", async (req: Request, res: Response, next: NextFunction) => {
            try {
                const startDate : Date = new Date(req.query.start)
                const endDate : Date = new Date(req.query.end)
            let a = await  getRepository(Livraison)
                .createQueryBuilder("livraison")
                 .leftJoinAndSelect("livraison.idCliClient", "client")
               // .select("livraison.dateLiv,count(livraison.dateLiv)")
                .where("livraison.dateLiv >= :startDate",{startDate : startDate})
                .andWhere("livraison.dateLiv <= :endDate",{endDate : endDate})
                
                .getMany()
                
            
            res.json(a)
            } catch (error) {
                next(error)
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