import express, { Request, Response, NextFunction } from "express"
var routerClient = express.Router()
routerClient.get("/",(req:Request, res: Response,next:NextFunction) => {
    res.json({message: "client test"})
})
export default routerClient;