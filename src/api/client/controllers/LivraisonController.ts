import { Controller } from "../../Controller";
import { Connection, Repository,createConnection } from "typeorm";


import { Client } from "../../../entities/Client";
import { Router,Response,Request, NextFunction } from "express";
import { Livraison } from "../../../entities/Livraison";
import { Produit } from "../../../entities/Produit";
import { ormconfig } from "../../../config";
export default class LivraisonController extends Controller{
    clientRepository : Repository<Client>
    livraisonRepository : Repository<Livraison>
    produitRepository : Repository<Produit>
    constructor(){
        super()
        this.createConnectionAndAssignRepository()
            .then(async(_)=>{
                await this.addAllRoutes(this.mainRouter)
            })
    }
    async createConnectionAndAssignRepository() : Promise<void>{
        let connection : Connection = await createConnection(ormconfig)
         this.clientRepository =  connection.getRepository(Client)
        this.livraisonRepository = connection.getRepository(Livraison) 
        this.produitRepository = connection.getRepository(Produit)
    }
    async addGet(router : Router){
        await this.allLivraison(router)
    }

    async allLivraison(router : Router) : Promise<void>{
        router.get("/:idClient/livraison",async (req:Request,res:Response,next : NextFunction)=>{
           
            let liv =await this.livraisonRepository.find({
               relations : ["produits","idCliClient"],
                where : {idCliClient : await this.clientRepository.findOne(req.params.idClient)}
            })
            if(liv !==undefined) {
                this.sendResponse(res,200,{
                    message : "success",
                    data : liv
                })
            }
        })
    }
    async addPost(router : Router){
        await this.setLivraison(router)
   
    }   /**
     *
     *
     * @param {Router} router
     * @returns {Promise<void>}
     * @memberof ClientController
     */
    async setLivraison(router: Router) : Promise<void>{
        router.post("/:idClient/livraison",async(req:Request,res:Response,next : NextFunction)=>{

            try{
                let livraisonInfo : Livraison = await this.createLivraisonFromRequest(req)
                    
                let livraisonInfoSaved : Livraison = await this.saveLivraisonInfoToDatabase(livraisonInfo)

                let produitLivraison : Produit[] = await this.createProduitsFromRequest(req)

                
                await this.saveLivraisonProduitToDb(produitLivraison,livraisonInfoSaved)
                    .then(()=>{
                        this.sendResponse(res,200,{
                            message : "livraison set "
                        })
                    }).catch(err=>{
                        this.passErrorToExpress(err, next)
                    })

               
            }catch(err) {
                this.passErrorToExpress(err, next)
            }
                       
        })
    }
   

    private async isLivraisionInfoSet(liv : Livraison) : Promise<boolean> {
        return liv !== undefined
    }
    private async saveLivraisonInfoToDatabase(liv : Livraison) : Promise<Livraison> {
        return await this.livraisonRepository.save(liv)
    }
    private async createLivraisonFromRequest(req:Request) : Promise<Livraison>{
        let client : Client = await this.clientRepository.findOne(req.params.idClient)
        let livraison = await  this.livraisonRepository.create(req.body as Object)
        livraison.idCliClient = client

        return livraison
    }
    
    private async createProduitsFromRequest(req:Request) : Promise<Produit[]>{
        
       return req.body.produit
   }
   private  async saveLivraisonProduitToDb(pr : Produit[],liv : Livraison) : Promise<void>{
        
        return await pr.forEach(prod =>{
            prod.idLivLivraison = liv
             this.produitRepository.save(prod)
            
       })   
       
   }
    async addDelete(router : Router){}
    async addPut(router : Router){}


}