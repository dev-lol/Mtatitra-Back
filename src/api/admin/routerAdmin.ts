import express, { Request, Response, NextFunction } from "express"
import AdminController from './controllers/AdminController';
import DateLimiteController from './controllers/DateLimiteController';
import TypeProduitController from './controllers/TypeProduitController';
import TypeCoursierController from './controllers/TypeCoursierController';
import ZoneController from './controllers/ZoneController';
import CoursierController from './controllers/CoursierController';
import EtatsController from './controllers/EtatController';
import LivraisonController from "./controllers/LivraisonController";
import TarifController from './controllers/TarifController';
import ClientController from './controllers/ClientController';
import LieuController from './controllers/LieuController';
import ResultatController from './controllers/ResultatController';

var routerAdmin = express.Router()
routerAdmin.use("/", new AdminController().mainRouter)
routerAdmin.use("/livraison", new LivraisonController().mainRouter)
routerAdmin.use("/datelimite", new DateLimiteController().mainRouter)
routerAdmin.use("/typecoursier", new TypeCoursierController().mainRouter)
routerAdmin.use("/typeproduit", new TypeProduitController().mainRouter)
routerAdmin.use("/zone", new ZoneController().mainRouter)
routerAdmin.use("/resultat", new ResultatController().mainRouter)
routerAdmin.use("/lieu", new LieuController().mainRouter)
routerAdmin.use("/coursier", new CoursierController().mainRouter)
routerAdmin.use("/etats", new EtatsController().mainRouter)
routerAdmin.use("/tarifs", new TarifController().mainRouter)
routerAdmin.use("/client", new ClientController().mainRouter)

export default routerAdmin;