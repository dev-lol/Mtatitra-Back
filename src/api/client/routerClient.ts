import express, { Request, Response, NextFunction } from "express"
import SignupController from './controllers/SignupController';
import ClientController from "./controllers/ClientController";
import LivraisonController from "./controllers/LivraisonController";
var routerClient = express.Router()
routerClient.use("/", new ClientController().mainRouter)
routerClient.use("/", new SignupController().mainRouter)
routerClient.use("/",new LivraisonController().mainRouter)
export default routerClient;