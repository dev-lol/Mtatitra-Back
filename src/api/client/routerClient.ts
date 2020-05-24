import express, { Request, Response, NextFunction } from "express"
import LoginController from './controllers/LoginController';
import SignupController from './controllers/SignupController';
import ClientController from "./controllers/ClientController";
var routerClient = express.Router()
routerClient.use("/", new LoginController().mainRouter)
routerClient.use("/", new SignupController().mainRouter)
routerClient.use("/",new ClientController().mainRouter)
export default routerClient;