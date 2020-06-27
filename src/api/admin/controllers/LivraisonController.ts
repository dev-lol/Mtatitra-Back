import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Admin } from "../../../entities/Admin"
import { Repository, Connection, createConnection, Any } from "typeorm";
import { ormconfig } from "../../../config";
import jwt from 'jsonwebtoken';
import { Livraison } from "../../../entities/Livraison";
import { isNull } from "util";
import { Coursier } from "../../../entities/Coursier";
export default class LivraisonController extends Controller {
    adminRepository: Repository<Admin>
    livraisonRepository : Repository<Livraison>
    coursierRepository : Repository<Coursier>
    constructor() {
        super()
        this.createConnectionAndAssignRepository()
            .then(async (_) => {
                await this.addAllRoutes(this.mainRouter)
            })
    }


    async createConnectionAndAssignRepository(): Promise<any> {
        let connection: Connection = await createConnection(ormconfig)
        this.adminRepository = connection.getRepository(Admin)
        this.livraisonRepository = connection.getRepository(Livraison)
        this.coursierRepository = connection.getRepository(Coursier)
    }
    async addGet(router: Router): Promise<void> {
        await this.livraisonSansCoursier(router)
        await this.allLivraison(router)

        await this.livStatByDate(router)
    }

    async livStatByDate(router : Router) : Promise<void>{
        router.get("/livraison/stat",async(req:Request,res:Response,next : NextFunction)=>{
            let a = await this.livraisonRepository
                .createQueryBuilder("livraison")
                .select("livraison.dateLiv,count(livraison.dateLiv)")
                
                .groupBy("livraison.dateLiv")
                .getRawMany()
                
            
            res.json(a)
        })
    } 

    async livraisonBetweenDate(router) : Promise<void> {
        try{
            router.get("/livraison/:date1/:date2",async (req: Request, res:Response, next : NextFunction) =>{
                let livraison : Livraison[] = await this.livraisonRepository
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
           
            let liv =await this.livraisonRepository.find({
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
                let livSansCoursier =await  this.livraisonRepository.find({
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
        return await this.livraisonRepository.save(liv)
    }

    private async fetchLivraisonToAsign(req : Request) : Promise<Livraison> {
        return await this.livraisonRepository.findOne(req.params.idLivraison)
    }

    private async createCoursierFromRequest(req : Request) : Promise<Coursier>{
        return await this.coursierRepository.findOne(req.params.idCoursier)
    }

    async addDelete(router: Router): Promise<void> {

    }
}