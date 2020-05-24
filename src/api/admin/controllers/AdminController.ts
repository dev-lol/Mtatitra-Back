import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import {Controller} from "../../Controller"
import {Admin} from "../../../entities/Admin"
import { Repository,Connection,createConnection } from "typeorm";
import { ormconfig } from "../../../config";
import { runInThisContext } from "vm";
export default class AdminController extends Controller{
   adminRepository : Repository<Admin>
    constructor(){
        super()
        this.createConnectionAndAssignRepository()
            .then(async(_) =>{
                await this.addAllRoutes(this.mainRouter)
            })
    }


    async createConnectionAndAssignRepository() :Promise<any>{
        let connection : Connection = await createConnection(ormconfig)
        this.adminRepository = connection.getRepository(Admin)
    }
    async addGet(router: Router) : Promise<void>{
        await this.getAllAdmin(router)
    }


    private async getAllAdmin(router : Router) : Promise<void> {
        router.get("/",async(req: Request,res: Response, next : NextFunction) =>{
            try {

                let admins : Admin[] = await this.fetchAdminsFromDatabase()

                res.json(admins)
            }catch(err ){

            }
        })
           
    }

    private async fetchAdminsFromDatabase() : Promise<Admin[]> {
        return await this.adminRepository.find()
    }
    async addPost(router : Router) : Promise<void> {
        await this.postAdmin(router)
    }

    async postAdmin(router : Router) {
        router.post("/", async  (req : Request,res : Response,next :NextFunction) =>{
            let adminToSave : Admin = await this.createAdminFromRequest(req)

          
            let adminSaved : Admin = await this.saveAdminToDatabase(adminToSave)

            if(await this.isAdminSaved(adminSaved)) {
                res.json("ao tsara")
            }else{
                res.json("tsy ao e")
            }
               
        })
    }

    private async isAdminSaved(admin : Admin) : Promise<boolean> {
        return admin !== undefined
    }
 
    private async createAdminFromRequest(req:Request) : Promise<Admin>  {
        return this.adminRepository.create(req.body as Object)
    }

    private async saveAdminToDatabase(admin : Admin) : Promise<Admin> {
        return await this.adminRepository.save(admin)
    }





    async addPut(router : Router) : Promise<void> {

    }

    async addDelete(router : Router) : Promise<void> {

    }
}