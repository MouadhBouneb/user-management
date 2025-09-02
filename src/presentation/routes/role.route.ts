import express from "express";
import roleController from "../controllers/role.controller";
import { authMiddleware } from "presentation/middleware/auth.middleware";
import { autoPermissionMiddleware } from "presentation/middleware/permission.middleware";

const router = express.Router();

router.use(authMiddleware);
router.use(autoPermissionMiddleware());

router.use("/", roleController);

export default router;