import express, { Request, Response, NextFunction } from "express"
import AdminController from './controllers/AdminController';
import DateLimiteController from './controllers/DateLimiteController';

var routerAdmin = express.Router()
 routerAdmin.use("/",new AdminController().mainRouter)
 routerAdmin.use("/datelimite/", new DateLimiteController().mainRouter)

export default routerAdmin;