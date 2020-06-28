import express, { Request, Response, NextFunction } from "express"
import CoursierController from './controllers/CoursierController';
import LivraisonController from "./controllers/LivraisonController"
import EtatsController from "./controllers/EtatController";

var routerCoursier = express.Router()
routerCoursier.use("/",new CoursierController().mainRouter)
routerCoursier.use("/livraison",new LivraisonController().mainRouter)
routerCoursier.use("/etats",new EtatsController().mainRouter)
export default routerCoursier;