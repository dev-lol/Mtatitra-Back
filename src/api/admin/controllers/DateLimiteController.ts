import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../../Controller"
import { DateLimite } from "../../../entities/DateLimite"
import { Repository, Connection, createConnection } from "typeorm";
import { ormconfig } from "../../../config";

export default class DateLimiteController extends Controller {
    dateLimiteRepository: Repository<DateLimite>
    constructor() {
        super()
        this.createConnectionAndAssignRepository()
            .then(async (_) => {
                await this.addAllRoutes(this.mainRouter)
            })
    }


    async createConnectionAndAssignRepository(): Promise<any> {
        let connection: Connection = await createConnection(ormconfig)
        this.dateLimiteRepository = connection.getRepository(DateLimite)
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllDateLimite(router)
    }


    private async getAllDateLimite(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {

                let dateLimites: DateLimite[] = await this.fetchDateLimitesFromDatabase()

                this.sendResponse(res, 200, { data: dateLimites })
            } catch (err) {

            }
        })

    }

    private async fetchDateLimitesFromDatabase(): Promise<DateLimite[]> {
        return await this.dateLimiteRepository.find({where: {estSupprime: false}})
    }
    async addPost(router: Router): Promise<void> {
        await this.postDateLimite(router)
    }

    async postDateLimite(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            let dateLimiteToSave: DateLimite = await this.createDateLimiteFromRequest(req)


            let dateLimiteSaved: DateLimite = await this.saveDateLimiteToDatabase(dateLimiteToSave)

            if (await this.isDateLimiteSaved(dateLimiteSaved)) {
                this.sendResponse(res,200,{message: "OK"})
            } else {
                this.sendResponse(res,400,{message: "KO"})
            }

        })
    }

    private async isDateLimiteSaved(dateLimite: DateLimite): Promise<boolean> {
        return dateLimite !== undefined
    }

    private async createDateLimiteFromRequest(req: Request): Promise<DateLimite> {
        let date = this.dateLimiteRepository.create(req.body as Object)
        date.estSupprime = false
        return date
    }

    private async saveDateLimiteToDatabase(dateLimite: DateLimite): Promise<DateLimite> {
        return await this.dateLimiteRepository.save(dateLimite)
    }





    async addPut(router: Router): Promise<void> {
        router.put("/:idDate",async (req: Request, res: Response, next: NextFunction) => {
            try {
                let date: DateLimite = await this.dateLimiteRepository.findOneOrFail(Number(req.params.idDate))
                date = this.dateLimiteRepository.merge(date, req.body as Object)
                date.estSupprime = false
                await this.dateLimiteRepository.save(date)
                this.sendResponse(res,200, {message: "Date changed"})
            } catch (error) {
                console.log(error)
                this.sendResponse(res,404, {message: "Date not found"})   
            }
                
        })
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idDate", async (req: Request, res: Response, next: NextFunction) => {
            try {
                let date: DateLimite = await this.dateLimiteRepository.findOneOrFail(Number(req.params.idDate))
                date.estSupprime = true
                await this.dateLimiteRepository.save(date)
                this.sendResponse(res,203, {message: "Date deleted"})
            } catch (error) {
                this.sendResponse(res,404, {message: "Date not found"})   
            }
                
        })
    }
}