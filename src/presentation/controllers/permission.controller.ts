import { Router, Request, Response } from "express";
import { CreatePermissionUseCase } from "application/use-cases/permission/createPermission.useCase";
import { GetPermissionUseCase } from "application/use-cases/permission/getPermission.useCase";
import { PermissionRepository } from "infrastructure/repositories/permission.repository";
import { CatchAsyncError } from "utils/errors/async.handler";

const router = Router();
const permissionRepo = new PermissionRepository();

router.post(
  "/",
  CatchAsyncError(async (req: Request, res: Response) => {
    const useCase = new CreatePermissionUseCase(permissionRepo);
    const permission = await useCase.execute(req.body);
    res.status(201).json({ message: "Permission created", data: permission });
  })
);

router.get(
  "/",
  CatchAsyncError(async (req: Request, res: Response) => {
    const useCase = new GetPermissionUseCase(permissionRepo);
    const permissions = await useCase.executeAll();
    res.json({ data: permissions });
  })
);

router.get(
  "/:id",
  CatchAsyncError(async (req: Request, res: Response) => {
    const useCase = new GetPermissionUseCase(permissionRepo);
    const permission = await useCase.execute(req.params.id);
    if (!permission)
      return res.status(404).json({ error: "Permission not found" });
    return res.json({ data: permission });
  })
);

export default router;
