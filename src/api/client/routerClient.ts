import express, { Request, Response, NextFunction } from "express"
import SignupController from './controllers/SignupController';
import ClientController from "./controllers/LivraisonController";
var routerClient = express.Router()
routerClient.use("/", new ClientController().mainRouter)
routerClient.use("/", new SignupController().mainRouter)
export default routerClient;