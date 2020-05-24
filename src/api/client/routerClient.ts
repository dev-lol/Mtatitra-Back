import express, { Request, Response, NextFunction } from "express"
import LoginController from './controllers/LoginController';
import SignupController from './controllers/SignupController';
var routerClient = express.Router()
routerClient.use("/", new LoginController().mainRouter)
routerClient.use("/", new SignupController().mainRouter)
export default routerClient;