import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Admin } from "../../../entities/Admin"
import { Connection, createConnection, getConnection, getRepository } from "typeorm";
import { ormconfig } from "../../../config";
import jwt from 'jsonwebtoken';
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
        router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
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

    }



    async addDelete(router: Router): Promise<void> {

    }
}