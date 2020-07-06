import express, { Request, Response, NextFunction } from "express"
import SignupController from './controllers/SignupController';
import ClientController from "./controllers/ClientController";
import LivraisonController from "./controllers/LivraisonController";
import TarifController from './controllers/TarifController';
import TypeCoursierController from './controllers/TypeCoursierController';
import TypeProduitController from './controllers/TypeProduitController';
import DateLimiteController from './controllers/DateLimiteController';
import LieuController from './controllers/LieuController';
var routerClient = express.Router()
routerClient.use("/", new ClientController().mainRouter)
routerClient.use("/", new SignupController().mainRouter)
routerClient.use("/livraison", new LivraisonController().mainRouter)
routerClient.use("/tarif", new TarifController().mainRouter)
routerClient.use("/typecoursier", new TypeCoursierController().mainRouter)
routerClient.use("/typeproduit", new TypeProduitController().mainRouter)
routerClient.use("/lieu", new LieuController().mainRouter)
routerClient.use("/datelimite", new DateLimiteController().mainRouter)
export default routerClient;