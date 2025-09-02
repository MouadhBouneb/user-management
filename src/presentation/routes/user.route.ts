import express from "express";
import {
  createUserController,
  getUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller";
import { authMiddleware } from "presentation/middleware/auth.middleware";
import { autoPermissionMiddleware } from "presentation/middleware/permission.middleware";

const router = express.Router();

// router.use(authMiddleware);
// router.use(autoPermissionMiddleware()); // automatically checks permission

router.post("/", createUserController);
router.get("/:id", getUserController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;
