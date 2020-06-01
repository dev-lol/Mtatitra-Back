import express, { Request, Response, NextFunction } from "express"
import SignupController from './controllers/SignupController';
import ClientController from "./controllers/ClientController";
import LivraisonController from "./controllers/LivraisonController";
import TarifController from './controllers/TarifController';
var routerClient = express.Router()
routerClient.use("/", new ClientController().mainRouter)
routerClient.use("/", new SignupController().mainRouter)
routerClient.use("/",new LivraisonController().mainRouter)
routerClient.use("/tarif",new TarifController().mainRouter)
export default routerClient;