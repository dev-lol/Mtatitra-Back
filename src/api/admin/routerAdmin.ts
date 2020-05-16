import express, { Request, Response, NextFunction } from "express"
import TestController from './controllers/TestController';
var routerAdmin = express.Router()
routerAdmin.get("/",(req:Request, res: Response,next:NextFunction) => {
    res.json({message: "admin test"})
})
routerAdmin.use("/test", new TestController().mainRouter)
export default routerAdmin;