import { Controller } from "../../Controller";
import { Connection, Repository } from "typeorm";
import { createConnection } from "net";
import { ormconfig } from "../../../config";
import { Client } from "../../../entities/Client";
import { Router,Response,Request, NextFunction } from "express";
import { Livraison } from "../../../entities/Livraison";
import { Produit } from "../../../entities/Produit";
export default class ClientController extends Controller{
    clientRepository : Repository<Client>
    livraisonRepository : Repository<Livraison>
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

    }
    async addGet(router : Router){}
    async addPost(router : Router){

    }
    async setLivraison(router: Router) : Promise<void>{
        router.post("/:idClient/livraison",async(req:Request,res:Response,next : NextFunction)=>{
            try{
                let livraisonInfoToSave : Livraison = await this.createLivraisonFromRequest(req)

                let livraisonInfoSaved : Livraison = await this.saveLivraisonInfoToDatabase(livraisonInfoToSave)
                let produitDuLivraison : Produit[] =await this.createProduitsFromRequest(req)

                if(await(this.isLivraisionInfoSet(livraisonInfoSaved))){

                }

            }catch(err){
                this.passErrorToExpress(err,next)
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
        return await this.livraisonRepository.create(req.body as Object)
    }
    private async createProduitsFromRequest(req:Request) : Promise<Produit[]>{
        let {idPro,fragilePro,longueurPro,largueurPro,hauteurPro,poidsPro,consignePro,prixPro,idTypeProTypeProduit} = req.body
       let pr:Produit[] = []
       for(var i:number = 0; i<idPro.length;i++){
           let p: Produit = new Produit()
           p.idPro = idPro[i]
           p.fragilePro = fragilePro[i]
           p.longueurPro = longueurPro[i]
           p.largueurPro = largueurPro[i]
           p.hauteurPro = hauteurPro[i]
           p.consignePro = consignePro[i]
           p.poidsPro = poidsPro[i]
           p.idTypeProTypeProduit = idTypeProTypeProduit[i]

           pr.push(p)

       }   

        return pr
   }
    async addDelete(router : Router){}
    async addPut(router : Router){}


}