import express from "express"
import routerAdmin from './admin/routerAdmin';
import routerClient from './client/routerClient';
import routerCoursier from './coursier/routerCoursier';
var router = express.Router()
router.use("/admin", routerAdmin);
router.use("/client", routerClient);
router.use("/coursier", routerCoursier);
export default router;