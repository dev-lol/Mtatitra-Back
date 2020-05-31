import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Coursier } from "../../../entities/Coursier"
import { Repository, Connection, createConnection, MoreThan } from "typeorm";
import { ormconfig } from "../../../config";
import jwt from 'jsonwebtoken';
import { sqlDateFormat } from "../../../utils/DateSqlFormat";
import { Livraison } from "../../../entities/Livraison";
import { Etats } from "../../../entities/Etats";
export default class LivraisonController extends Controller {
    coursierRepository: Repository<Coursier>
    livraisonRepository : Repository<Livraison>
    etatRepository : Repository<Etats>
    constructor() {
        super()
        this.createConnectionAndAssignRepository()
            .then(async (_) => {
                await this.addAllRoutes(this.mainRouter)
            })
    }


    async createConnectionAndAssignRepository(): Promise<any> {
        let connection: Connection = await createConnection(ormconfig)
        this.coursierRepository = connection.getRepository(Coursier)
        this.livraisonRepository = connection.getRepository(Livraison)
        this.etatRepository = connection.getRepository(Etats)
    }
    async addGet(router: Router): Promise<void> {
        await this.recentLivraison(router)
       
    }

    async recentLivraison(router : Router) : Promise<void>{
        router.get("/livraison",async(req:Request,res:Response,next : NextFunction) =>{
            try{
                const currentDate =new Date().toISOString()
                let next8Hours = new Date()
                next8Hours.setHours(next8Hours.getHours() + 24)
                next8Hours.toISOString()
                let nas : string = sqlDateFormat(next8Hours)
                  let blabla : Livraison[]= await  this.livraisonRepository
                  .createQueryBuilder("livraison")
                  .where("livraison.dateLiv > :date1",{date1 : currentDate})
                  .andWhere("livraison.dateLiv < :date2",{date2 : next8Hours})
                .getMany()

               this.sendResponse(res,200, blabla)
            }catch(err) {

            }
        })
    }
    async addPost(router: Router): Promise<void> {
       
        
    }

  
    
    async addPut(router: Router): Promise<void> {
        await this.updateLivraison(router)
    }

    async updateLivraison(router) : Promise<void>{
        try{
            router.put("/livraison/:idLivraison",async(req:Request,res:Response,next :NextFunction) =>{
                 let livraisonToUpdate : Livraison = await this.fetchLivraisonToUpdateFromDb(req)
               let nouveauEtat : Etats = await this.createEtatFromRequest(req)
               let livraisonUpdated : Livraison= await this.updateEtatLivraison(livraisonToUpdate,nouveauEtat)  

               this.sendResponse(res, 200 , {
                   message : "success",
                   data : nouveauEtat
               })
           })
        }catch(err) {
            console.log(err)
            //this.passErrorToExpress(next ,err)
        }
        
    }

    private async updateEtatLivraison( liv : Livraison,etat : Etats) : Promise<Livraison>{
        liv.idEtaEtats = etat
        return await this.livraisonRepository.save(liv)
    }

    private async createEtatFromRequest(req : Request) : Promise<Etats>{
        return await this.etatRepository.create(req.body as Object)
    }


    private async fetchLivraisonToUpdateFromDb(req : Request) : Promise<Livraison> {
        return await this.livraisonRepository.findOne(req.params.idLivraison)
    }


    async addDelete(router: Router): Promise<void> {

    }
}