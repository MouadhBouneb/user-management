import express from "express";
import permissionController from "../controllers/permission.controller";
import { authMiddleware } from "presentation/middleware/auth.middleware";
import { autoPermissionMiddleware } from "presentation/middleware/permission.middleware";

const router = express.Router();

router.use(authMiddleware);
router.use(autoPermissionMiddleware());

router.use("/", permissionController);

export default router;