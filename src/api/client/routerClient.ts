import express, { Request, Response, NextFunction } from "express"
import ClientController from "./controllers/ClientController";
var routerClient = express.Router()
routerClient.use("/",new ClientController().mainRouter)

export default routerClient;