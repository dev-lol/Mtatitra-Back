import express, { Request, Response, NextFunction } from "express"
var routerCoursier = express.Router()
routerCoursier.get("/",(req:Request, res: Response,next:NextFunction) => {
    res.json({message: "coursier test"})
})
export default routerCoursier;