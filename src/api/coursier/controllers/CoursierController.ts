import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Coursier } from "../../../entities/Coursier"
import { getRepository, Connection, createConnection, getConnection } from "typeorm";

import jwt from 'jsonwebtoken';
import { Livraison } from "../../../entities/Livraison";
import { Etats } from "../../../entities/Etats";
import ErrorValidator from "../../ErrorValidator";
import { body } from "express-validator";
export default class CoursierController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {
        this.getProfile(router);
    }


    private getProfile(router: Router) {
        router.get("/profile", async (req: Request, res: Response, next: NextFunction) => {
            try {
                console.log(res.locals.id)
                let coursier = await getRepository(Coursier).findOneOrFail(res.locals.id);
                delete coursier.passCou;
                this.sendResponse(res, 200, coursier);
            }
            catch (error) {

                this.sendResponse(res, 404, { message: "Not found" });

            }
        });
    }

    async addPost(router: Router): Promise<void> {
        await this.postCoursier(router)

    }

    async postCoursier(router: Router) {
        router.post("/login", [
            body(['password', 'username']).notEmpty().withMessage('Champs vide'),
        ], ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                try {

                    let coursier = await getRepository(Coursier).findOneOrFail({ where: { usernameCou: req.body.username } })
                    var bcrypt = require("bcrypt")
                    bcrypt.compare(req.body.password, coursier.passCou, (err, isSame) => {
                        if (!err && isSame) {
                            this.sendResponse(res, 200, {
                                token: jwt.sign({ id: coursier.idCou, username: coursier.usernameCou }, process.env.COURSIER_PASS_PHRASE, { expiresIn: "30d" })
                            })
                        } else {
                            this.sendResponse(res, 401, {
                                message: "Invalid credentials"
                            })
                        }
                    })
                } catch (error) {
                    this.sendResponse(res, 401, {
                        message: "Invalid credentials"
                    })
                }

            })
    }



    async addPut(router: Router): Promise<void> {
        await this.updateLivraison(router)
    }

    async updateLivraison(router): Promise<void> {
        router.put("/livraison/:idLivraison", [
            // body(['password', 'username']).notEmpty().withMessage('donnee incomplete'),
        ],
            ErrorValidator,
            async (req: Request, res: Response, next: NextFunction) => {
                let livraisonToUpdate: Livraison = await this.fetchLivraisonToUpdateFromDb(req)
                let nouveauEtat: Etats = await this.createEtatFromRequest(req)
                let livraisonUpdated: Livraison = await this.updateEtatLivraison(livraisonToUpdate, nouveauEtat)

                this.sendResponse(res, 200, {
                    message: "success",
                    data: livraisonUpdated
                })
            })
    }

    private async updateEtatLivraison(liv: Livraison, etat: Etats): Promise<Livraison> {
        liv.idEtaEtats = etat
        return getRepository(Livraison).save(liv)
    }

    private async createEtatFromRequest(req: Request): Promise<Etats> {
        return await getRepository(Etats).create(req.body as Object)
    }


    private async fetchLivraisonToUpdateFromDb(req: Request): Promise<Livraison> {
        return await getRepository(Livraison).findOne(req.params.idLivraison)
    }


    async addDelete(router: Router): Promise<void> {

    }
}