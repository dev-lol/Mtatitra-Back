import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Coursier } from "../../../entities/Coursier"
import { Repository, Connection, createConnection, MoreThan } from "typeorm";
import { ormconfig } from "../../../config";
import { Livraison } from "../../../entities/Livraison";
import { Etats } from "../../../entities/Etats";
import { CustomServer } from '../../Server';
export default class LivraisonController extends Controller {
    coursierRepository: Repository<Coursier>
    livraisonRepository: Repository<Livraison>
    etatRepository: Repository<Etats>
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
        await this.todayLivraison(router)
        await this.tomorrowLivraison(router)

    }

    async tomorrowLivraison(router): Promise<void> {
        router.get(":idCou/demain", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let tomorrowLiv: Livraison[] = await this.livraisonRepository
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.idCliClient", "client")
                    .leftJoinAndSelect("livraison.idLimiteDat", "limiteDat")
                    .leftJoinAndSelect("livraison.idEtaEtats", "etat")
                    .leftJoinAndSelect("livraison.idTypeLivTypeLivraison", "typeLivraison")
                    .leftJoinAndSelect("livraison.idZonDepart", "zoneDepart")
                    .leftJoinAndSelect("livraison.idZonArrivee", "zoneArrivee")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduits")
                    .where("livraison.idCouCoursier = :id", { id: req.params.idCou })
                    .andWhere("livraison.dateLiv > CURRENT_DATE  ")
                    .andWhere("livraison.dateLiv < CURRENT_DATE +2 ")
                    .getMany()

                this.sendResponse(res, 200, tomorrowLiv)
            } catch (err) {

            }
        })
    }
    async todayLivraison(router: Router): Promise<void> {
        router.get(":idCou/aujourdhui", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let todayLiv: Livraison[] = await this.livraisonRepository
                    .createQueryBuilder("livraison")
                    .leftJoinAndSelect("livraison.idCliClient", "client")
                    .leftJoinAndSelect("livraison.idLimiteDat", "limiteDat")
                    .leftJoinAndSelect("livraison.idEtaEtats", "etat")
                    .leftJoinAndSelect("livraison.idTypeLivTypeLivraison", "typeLivraison")
                    .leftJoinAndSelect("livraison.idZonDepart", "zoneDepart")
                    .leftJoinAndSelect("livraison.idZonArrivee", "zoneArrivee")
                    .leftJoinAndSelect("livraison.produits", "produits")
                    .leftJoinAndSelect("produits.idTypeProTypeProduit", "typeProduits")
                    .where("livraison.idCouCoursier = :id", { id: req.params.idCou })
                    .andWhere("livraison.dateLiv >= CURRENT_DATE  ")
                    .andWhere("livraison.dateLiv < CURRENT_DATE +1 ")
                    .getMany()

                this.sendResponse(res, 200, todayLiv)
            } catch (err) {

            }
        })
    }

    async addPost(router: Router): Promise<void> {


    }



    async addPut(router: Router): Promise<void> {
        await this.patchEtat(router)
    }

    async patchEtat(router): Promise<void> {
        router.patch("/:idLivraison", async (req: Request, res: Response, next: NextFunction) => {
            let livraisonToUpdate: Livraison = await this.fetchLivraisonToUpdateFromDb(req)
            livraisonToUpdate.idEtaEtats = await this.etatRepository.findOneOrFail(req.body.idEta)
            let livraison = await this.livraisonRepository.save(livraisonToUpdate)
            CustomServer.io.to("client " + livraison.idCliClient.idCli).emit("etats", livraison.idEtaEtats.etatEta)
            this.sendResponse(res, 200, {
                message: "Etat changed"
            })
        })
    }

    private async fetchLivraisonToUpdateFromDb(req: Request): Promise<Livraison> {
        return await this.livraisonRepository.findOneOrFail(req.params.idLivraison)
    }


    async addDelete(router: Router): Promise<void> {

    }
}