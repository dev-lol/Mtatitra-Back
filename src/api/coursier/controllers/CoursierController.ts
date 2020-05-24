import { Controller } from "../../Controller";
import { Repository, Connection, createConnection } from "typeorm";
import { Coursier } from "../../../entities/Coursier";
import { Router,Response,Request, NextFunction } from "express";
import { ormconfig } from "../../../config";
import { TypeCoursier } from "../../../entities/TypeCoursier";
import { Livraison } from "../../../entities/Livraison";
import { Produit } from "../../../entities/Produit";

export default class CoursierController extends Controller{
    coursierRepository : Repository<Coursier>
    livraisonRepository : Repository<Livraison>
    produitRepository : Repository<Produit>
    constructor(){
        super()
        this.createConnectionAndAssignRepository()
            .then(async(_) =>{
                await this.addAllRoutes(this.mainRouter)
            })
    }

    async createConnectionAndAssignRepository() : Promise<any> {
        let connection : Connection = await createConnection(ormconfig)
        this.coursierRepository = connection.getRepository(Coursier)
        this.livraisonRepository = connection.getRepository(Livraison)
        this.produitRepository = connection.getRepository(Produit)
    }

    async addGet(router : Router)  :Promise<void>{
        await this.getAllCoursier(router)
        
    }

    private async getAllCoursier(router : Router) : Promise<void> {
        router.get("/", async (req:Request,res:Response) =>{
            try {

                let coursiers : Coursier[] = await this.fetchCoursierFromDatabase()

                res.json(coursiers)
            }catch(err ){

            }
        })
    }

    

    private async fetchCoursierFromDatabase() : Promise<Coursier[]> {
        return await this.coursierRepository.find()
    }


    async addPost(router : Router) : Promise<void> {
        await this.addCoursier(router)
    }

   

     async addCoursier(router : Router) {
         
            router.post("/",async (req:Request, res: Response, next : NextFunction)=>{
                try{
                    let coursierToSave : Coursier = await this.createCoursierFromRequest(req)
                
                let coursierSaved : Coursier =  await this.saveCoursierToDatabase(coursierToSave)
              
                if(await this.isCoursierSaved(coursierSaved)) {
                   this.sendResponse(res,200, {
                       message : "coursier added successfully"
                   })
                }else{
                   this.sendResponse(res,500, {
                       message :"coursier not added"
                   })
                }

            } catch(err) {
                    this.passErrorToExpress(err, next)
                }
                
            })
        
         
             
         
     }

    

     private async isCoursierSaved(coursier : Coursier) : Promise<boolean> {
         return coursier !== undefined
     }
     
     private async createCoursierFromRequest(req:Request) : Promise<Coursier> {
         return this.coursierRepository.create(req.body as Object)
     }

     private async saveCoursierToDatabase(coursier : Coursier) : Promise<Coursier>{
         return await this.coursierRepository.save(coursier)
     }
    async addPut(router : Router) : Promise<void>{

    }

    async addDelete(router : Router) : Promise<void>{
        this.deleteById(router)
    }

    private async deleteById(router : Router) : Promise<void>{
        router.delete("/:idCou", async (req:Request,res:Response,next : NextFunction) =>{
            try{
                let coursier : Coursier  = await this.coursierRepository.findOne(req.params.id)

                await this.coursierRepository.remove(coursier)

                res.status(204).json({
                    message : "coursier deleted"
                })


            }catch(err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

 
}