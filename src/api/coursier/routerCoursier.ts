import express, { Request, Response, NextFunction } from "express"
import CoursierController from './controllers/CoursierController';
import LivraisonController from "./controllers/LivraisonController"

var routerCoursier = express.Router()
routerCoursier.use("/",new CoursierController().mainRouter)
routerCoursier.use("/",new LivraisonController().mainRouter)
export default routerCoursier;