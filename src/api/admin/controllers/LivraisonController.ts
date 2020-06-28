import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Admin } from "../../../entities/Admin"
import { getRepository, MoreThan } from "typeorm";
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
        await this.getLivraison(router)
        await this.livStatByDate(router)
    }

    async livStatByDate(router : Router) : Promise<void>{
        router.get("/livraison/stat",async(req:Request,res:Response,next : NextFunction)=>{
            let a = await  getRepository(Livraison)
                .createQueryBuilder("livraison")
                .select("livraison.dateLiv,count(livraison.dateLiv)")
                
                .groupBy("livraison.dateLiv")
                .getRawMany()
                
            
            res.json(a)
        })
    } 

    async getLivraison(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            if (req.query.coursier && req.query.date) {
                let liv = []
                const date = new Date(req.query.date)
                switch (req.query.coursier) {
                    case 'all':
                        liv = await getRepository(Livraison)
                            .createQueryBuilder("livraison")
                            .leftJoinAndSelect("livraison.idCliClient", "client")
                            .leftJoinAndSelect("livraison.produits", "produits")
                            .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduit")
                            .leftJoinAndSelect("livraison.idCouCoursier", "coursier")
                            .leftJoinAndSelect("livraison.idTypeCouTypeCoursier", "typeCoursier")
                            .leftJoinAndSelect("typeCoursier.coursiers", "coursierPossible")
                            .where("livraison.dateLiv = :date", { date: date })
                            .getMany()
                        break;

                    case 'true':
                        liv = await getRepository(Livraison)
                            .createQueryBuilder("livraison")
                            .leftJoinAndSelect("livraison.idCliClient", "client")
                            .leftJoinAndSelect("livraison.produits", "produits")
                            .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduit")
                            .leftJoinAndSelect("livraison.idCouCoursier", "coursier")
                            .leftJoinAndSelect("livraison.idTypeCouTypeCoursier", "typeCoursier")
                            .leftJoinAndSelect("typeCoursier.coursiers", "coursierPossible")
                            .where("livraison.dateLiv = :date", { date: date })
                            .andWhere("livraison.idCouCoursier is not null")
                            .getMany()
                        break;
                    case 'false':
                        liv = await getRepository(Livraison)
                            .createQueryBuilder("livraison")
                            .leftJoinAndSelect("livraison.idCliClient", "client")
                            .leftJoinAndSelect("livraison.produits", "produits")
                            .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduit")
                            .leftJoinAndSelect("livraison.idTypeCouTypeCoursier", "typeCoursier")
                            .leftJoinAndSelect("livraison.idCouCoursier", "coursier")
                            .leftJoinAndSelect("typeCoursier.coursiers", "coursierPossible")
                            .where("livraison.dateLiv = :date", { date: date })
                            .andWhere("livraison.idCouCoursier is null")
                            .getMany()
                        break;
                    default:
                        break;
                }

                this.sendResponse(res, 200, liv)
            } else {
                this.sendResponse(res, 400, { message: "query incomplete" })
            }
        })
    }
    async addPost(router: Router): Promise<void> {


    }




    async addPut(router: Router): Promise<void> {
        await this.addCoursierToLivraison(router)
    }

    async addCoursierToLivraison(router: Router): Promise<void> {
        router.patch("/:idLivraison/coursier/:idCoursier", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let livraisonToAsign: Livraison = await this.fetchLivraisonToAsign(req)
                let coursier: Coursier = await this.createCoursierFromRequest(req)
                await this.asignCouriserToLivraison(coursier, livraisonToAsign)
                this.sendResponse(res, 200, { message: "Coursier Assigned to Livraison" })
            }
            catch (err) {
                this.sendResponse(res, 400, { message: "Erreur" })
            }
        })
    }

    private async asignCouriserToLivraison(cou: Coursier, liv: Livraison): Promise<Livraison> {
        liv.idCouCoursier = cou
        return await getRepository(Livraison).save(liv)
    }

    private async fetchLivraisonToAsign(req: Request): Promise<Livraison> {
        return await getRepository(Livraison).findOne(req.params.idLivraison)
    }

    private async createCoursierFromRequest(req: Request): Promise<Coursier> {
        return { ...new Coursier(), idCou: Number(req.params.idCoursier) }
    }

    async addDelete(router: Router): Promise<void> {

    }
}