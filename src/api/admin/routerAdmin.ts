import express, { Request, Response, NextFunction } from "express"
import AdminController from './controllers/AdminController';

var routerAdmin = express.Router()
 routerAdmin.use("/",new AdminController().mainRouter)

export default routerAdmin;