import express, { Request, Response, NextFunction } from "express"
import CoursierController from "./controllers/CoursierController";

var routerCoursier = express.Router()
routerCoursier.use("/",new CoursierController().mainRouter)

export default routerCoursier;