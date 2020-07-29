import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Admin } from "../../../entities/Admin"
import { Connection, createConnection, getConnection, getRepository } from "typeorm";

import jwt from 'jsonwebtoken';
import ErrorValidator from "../../ErrorValidator";
import { body } from 'express-validator';
import Password from "../../../utils/Password";
export default class AdminController extends Controller {
    constructor() {
        super()
        this.addAllRoutes(this.mainRouter)
    }
    async addGet(router: Router): Promise<void> {

    }
    async addPost(router: Router): Promise<void> {
        await this.postAdmin(router)

    }



    async postAdmin(router: Router) {
        router.post("/login", [
            body(['password', 'username']).notEmpty().withMessage('donnee incomplete'),
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            let admin = await getRepository(Admin).findOneOrFail({ where: { emailAdm: req.body.username } })
            var bcrypt = require("bcrypt")
            bcrypt.compare(req.body.password, admin.passAdm, (err, isSame) => {
                if (!err && isSame) {
                    this.sendResponse(res, 200, {
                        token: jwt.sign({ admin: admin.emailAdm }, process.env.ADMIN_PASS_PHRASE, { expiresIn: "30d" })
                    })
                } else {
                    this.sendResponse(res, 401, {
                        message: "Invalid credentials"
                    })
                }
            })

        })
    }

    async addPut(router: Router): Promise<void> {
        router.put("/reset", [
            body(['oldPass', 'newPass']).notEmpty()
        ], ErrorValidator, async (req: Request, res: Response, next: NextFunction) => {
            let admin: Admin = await getRepository(Admin).findOne()
            try {
                if (await Password.compare(req.body.oldPass, admin.passAdm)) {
                    let bcrypt = require("bcrypt")
                    await bcrypt.hash(req.body.newPass, Number(process.env.SALT), async (err, hash) => {
                        if (err)
                            throw err
                        admin.passAdm = hash
                        await getRepository(Admin).save(admin)
                        this.sendResponse(res, 200, { message: "Votre mot de passe a été changé" })
                    });
                }
            } catch (error) {
                this.sendResponse(res,400, {message: "Old password faux"})
            }
        })
    }



    async addDelete(router: Router): Promise<void> {

    }
}