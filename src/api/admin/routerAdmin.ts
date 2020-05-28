import express, { Request, Response, NextFunction } from "express"
import AdminController from './controllers/AdminController';
import DateLimiteController from './controllers/DateLimiteController';
import TypeLivraisonController from './controllers/TypeLivraisonController';
import TypeProduitController from './controllers/TypeProduitController';
import TypeCoursierController from './controllers/TypeCoursierController';

var routerAdmin = express.Router()
 routerAdmin.use("/",new AdminController().mainRouter)
 routerAdmin.use("/datelimite", new DateLimiteController().mainRouter)
 routerAdmin.use("/typelivraison", new TypeLivraisonController().mainRouter)
 routerAdmin.use("/typecoursier", new TypeCoursierController().mainRouter)
 routerAdmin.use("/typeproduit", new TypeProduitController().mainRouter)

export default routerAdmin;