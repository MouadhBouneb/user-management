import express from "express";
import {
  createUserController,
  getUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller";
import { authMiddleware } from "presentation/middleware/auth.middleware";
import { autoPermissionMiddleware } from "presentation/middleware/permission.middleware";
import { validateBody, validateParams } from "shared/middleware/validation.middleware";
import { createUserSchema, updateUserSchema, userParamsSchema } from "shared/validation/user.validation";

const router = express.Router();

// router.use(authMiddleware);
// router.use(autoPermissionMiddleware()); // automatically checks permission

router.post("/", validateBody(createUserSchema), createUserController);
router.get("/:id", validateParams(userParamsSchema), getUserController);
router.put("/:id", validateParams(userParamsSchema), validateBody(updateUserSchema), updateUserController);
router.delete("/:id", validateParams(userParamsSchema), deleteUserController);

export default router;
