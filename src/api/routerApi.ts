import express from "express"
import routerAdmin from './admin/routerAdmin';
import routerClient from './client/routerClient';
import routerCoursier from './coursier/routerCoursier';
import securityAdmin from './security/SecurityAdmin';
import securityCoursier from './security/SecurityCoursier';
import securityClient from './security/SecurityClient';
var router = express.Router()
router.use("/admin", securityAdmin);
router.use("/admin", routerAdmin);
router.use("/client", securityClient);
router.use("/client", routerClient);
router.use("/coursier", securityCoursier);
router.use("/coursier", routerCoursier);
export default router;