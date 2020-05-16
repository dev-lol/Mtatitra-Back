import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";

import { Controller } from "../../Controller";

export default class TestController extends Controller {

    // clientRepository: Repository<Client>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            // var connection: Connection = await createConnection(ormconfig)
            // this.clientRepository = connection.getRepository(Client)    
        } catch (error) {
            console.log(error)
        }
        
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllClient(router)
        await this.getSingleClient(router)
    }

    private async getAllClient(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            this.sendResponse(res,200,{message: "test success"})
            // try {
            //     var clients: Client[] = await this.fetchClientsFromDatabase()
            //     var structuredClientData = await this.useIdClientAsKey(clients)
            //     await this.sendResponse(res, 200, { data: structuredClientData })
            //     next()
            // } catch (err) {
            //     await this.passErrorToExpress(err, next)
            // }

        })
    }

    private async getSingleClient(router: Router) {
        router.get("/:id", async (req, res, next) => {
            // try {
            //     var client: Client = await this.fetchClientFromDatabase(req.params.id)
            //     if (await this.isClientExist(client)) {
            //         await this.sendResponse(res, 200, { data: client })
            //     } else {
            //         await this.sendResponse(res, 404, { message: "Client Not Found" })
            //     }
            //     next()
            // } catch (err) {
            //     await this.passErrorToExpress(err, next)
            // }
        })
    }
    async addPost(router: Router): Promise<void> {
        await this.postClient(router)
    }

    async postClient(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            // try {
            //         var clientToSave: Client = await this.createClientFromRequest(req)
            //         var clientSaved: Client = await this.saveClientToDatabase(clientToSave)
            //         if (await this.isClientSaved(clientSaved))
            //             await this.sendResponse(res, 201, { message: "Client Added Successfully" })
            //         else
            //             await this.sendResponse(res, 403, { message: "Client Not Added" })
            //     next()
            // } catch (err) {
            //     await this.passErrorToExpress(err, next)
            // }
        })
    }

    async addDelete(router: Router): Promise<void> {

        await this.deleteById(router);
    }
    
    private async deleteById(router: Router): Promise<void>{
        router.delete("/:idClient", async (req: Request, res: Response, next: NextFunction) => {
            // try {
            //     var client: Client = await this.clientRepository.findOne(req.params.idClient)
            //     await this.clientRepository.remove(client)
            //     res.status(204).json({ message: "deleted successfully" });
            // }
            // catch (err) {
            //     this.passErrorToExpress(err, next);
            // }
        });
    }

  
    async addPut(router: Router): Promise<void> {
        router.put("/:id", async (req, res, next) => {
            // try {

            //     var clientToModify: Client = await this.fetchClientFromDatabase(req.params.id)
            //     if (this.isClientExist(clientToModify)) {
            //         var clientModifiedReadyToSave: Client = await this.mergeClientFromRequest(clientToModify, req)
            //         var clientModified: Client = await this.updateClientInDatabase(clientModifiedReadyToSave)
            //         if (await this.isClientExist(clientModified))
            //             await this.sendResponse(res, 204, { message: "Client Modified Successfully" })
            //         else
            //             await this.sendResponse(res, 403, { message: "Client Not Modified" })
            //     } else {
            //         await this.sendResponse(res, 404, { message: "Client Not Found" })
            //     }
            //     next()
            // } catch (err) {
            //     this.passErrorToExpress(err, next)
            // }
        })
    }
}