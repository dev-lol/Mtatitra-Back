import express, { Request, Response, NextFunction } from "express"
import AdminController from './controllers/AdminController';
import DateLimiteController from './controllers/DateLimiteController';
import TypeLivraisonController from './controllers/TypeLivraisonController';

var routerAdmin = express.Router()
 routerAdmin.use("/",new AdminController().mainRouter)
 routerAdmin.use("/datelimite", new DateLimiteController().mainRouter)
 routerAdmin.use("/typelivraison", new TypeLivraisonController().mainRouter)

export default routerAdmin;