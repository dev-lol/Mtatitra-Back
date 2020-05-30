import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { Admin } from "../../../entities/Admin"
import { Repository, Connection, createConnection } from "typeorm";
import { ormconfig } from "../../../config";
import jwt from 'jsonwebtoken';
import { Livraison } from "../../../entities/Livraison";
import { isNull } from "util";
import { Coursier } from "../../../entities/Coursier";
export default class AdminController extends Controller {
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
      
    }

    
    private async fetchAdminsFromDatabase(): Promise<Admin[]> {
        return await this.adminRepository.find()
    }
    async addPost(router: Router): Promise<void> {
        await this.postAdmin(router)
        
    }

      

    async postAdmin(router: Router) {
        router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
            let admin = await this.adminRepository.findOneOrFail({where: {emailAdm: req.body.username}})
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