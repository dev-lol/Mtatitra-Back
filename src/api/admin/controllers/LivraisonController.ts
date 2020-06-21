import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Admin } from "../../../entities/Admin"
import { getRepository, Connection, createConnection, getConnection } from "typeorm";
import { ormconfig } from "../../../config";
import jwt from 'jsonwebtoken';
import { Livraison } from "../../../entities/Livraison";
import { isNull } from "util";
import { Coursier } from "../../../entities/Coursier";
export default class LivraisonController extends Controller {
    constructor() {
        super()
this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        await this.livraisonSansCoursier(router)
        await this.allLivraison(router)
    }

    async livraisonBetweenDate(router) : Promise<void> {
        try{
            router.get("/livraison/:date1/:date2",async (req: Request, res:Response, next : NextFunction) =>{
                let livraison : Livraison[] = await getRepository(Livraison)
                    .createQueryBuilder("livraison")
                    .where("livraison.dateLiv >= :date1",{date1  : req.params.date1})
                    .andWhere("livraison.dateLiv <= :date2",{date2 : req.params.date2})
                    .getMany()
                this.sendResponse(res, 200, {
                    message : "success",
                    data : livraison
                })
            })
        }catch(err) 
        {

        }
    }

    async allLivraison(router : Router) : Promise<void>{
        router.get("/livraison",async (req:Request,res:Response,next : NextFunction)=>{
           
            let liv =await getRepository(Livraison).find({
               relations : ["produits","idCliClient","idCouCoursier"],
            })
            if(liv !==undefined) {
                this.sendResponse(res,200,{
                    message : "success",
                    data : liv
                })
            }
        })
    }

    async livraisonSansCoursier(router : Router) : Promise<void>{
        try {
            router.get("/livraison/no-coursier",async (req: Request,res: Response, next : NextFunction) =>{
                let livSansCoursier =await  getRepository(Livraison).find({
                    relations : ["idCouCoursier"],
                   where : {idCouCoursier : null}
                })
                this.sendResponse(res,200,{
                    message :"success",
                    data :livSansCoursier
                })
            })
        }catch(err){
           // this.passErrorToExpress(err, next)
        }
        
    }

    
    async addPost(router: Router): Promise<void> {
       
        
    }

      

    
    async addPut(router: Router): Promise<void> {
        await this.addCoursierToLivraison(router)
    }

    async addCoursierToLivraison(router : Router)  : Promise<void>{
        try{
            router.put("/:idCoursier/livraison/:idLivraison",async (req: Request,res : Response, next : NextFunction) =>{
                let livraisonToAsign : Livraison = await this.fetchLivraisonToAsign(req)
                let coursier : Coursier = await this.createCoursierFromRequest(req)
    
                let livraisonAsigned = await this.asignCouriserToLivraison(coursier,livraisonToAsign)

                this.sendResponse(res,200, {
                    message :"success",
                    data : livraisonAsigned
                })
            })
        }
        catch(err) {

//            this.passErrorToExpress(err, next)
        }
        

            
       
    } 

    private async asignCouriserToLivraison(cou : Coursier, liv : Livraison ) : Promise<Livraison> {
        liv.idCouCoursier = cou
        return await getRepository(Livraison).save(liv)
    }

    private async fetchLivraisonToAsign(req : Request) : Promise<Livraison> {
        return await getRepository(Livraison).findOne(req.params.idLivraison)
    }

    private async createCoursierFromRequest(req : Request) : Promise<Coursier>{
        return await getRepository(Coursier).findOne(req.params.idCoursier)
    }

    async addDelete(router: Router): Promise<void> {

    }
}