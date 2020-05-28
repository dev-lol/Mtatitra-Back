import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Coursier } from "../../../entities/Coursier"
import { Repository, Connection, createConnection } from "typeorm";
import { ormconfig } from "../../../config";
import jwt from 'jsonwebtoken';
export default class CoursierController extends Controller {
    coursierRepository: Repository<Coursier>
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
    }
    async addGet(router: Router): Promise<void> {

    }
    async addPost(router: Router): Promise<void> {
        await this.postCoursier(router)
    }

    async postCoursier(router: Router) {
        router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
            let coursier = await this.coursierRepository.findOneOrFail({where: {usernameCou: req.body.username}})
            var bcrypt = require("bcrypt")
            bcrypt.compare(req.body.password, coursier.passCou, (err, isSame) => {
                if (!err && isSame) {
                    this.sendResponse(res, 200, {
                        token: jwt.sign({ coursier: coursier.usernameCou}, process.env.COURSIER_PASS_PHRASE, { expiresIn: "30j" })
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