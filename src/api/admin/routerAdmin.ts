import express, { Request, Response, NextFunction } from "express"
import AdminController from './controllers/AdminController';
import DateLimiteController from './controllers/DateLimiteController';
import TypeLivraisonController from './controllers/TypeLivraisonController';
import TypeProduitController from './controllers/TypeProduitController';
import TypeCoursierController from './controllers/TypeCoursierController';
import ZoneController from './controllers/ZoneController';
import CoursierController from '../coursier/controllers/CoursierController';
import EtatsController from './controllers/EtatController';
import LivraisonController from "./controllers/LivraisonController";

var routerAdmin = express.Router()
 routerAdmin.use("/",new AdminController().mainRouter)
routerAdmin.use("/",new LivraisonController().mainRouter)
 routerAdmin.use("/datelimite", new DateLimiteController().mainRouter)
 routerAdmin.use("/typelivraison", new TypeLivraisonController().mainRouter)
 routerAdmin.use("/typecoursier", new TypeCoursierController().mainRouter)
 routerAdmin.use("/typeproduit", new TypeProduitController().mainRouter)
 routerAdmin.use("/zone", new ZoneController().mainRouter)
 routerAdmin.use("/coursier", new CoursierController().mainRouter)
 routerAdmin.use("/etats", new EtatsController().mainRouter)

export default routerAdmin;