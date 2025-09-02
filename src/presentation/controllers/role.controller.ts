import { Router, Request, Response } from "express";
import { CreateRoleUseCase } from "application/use-cases/role/createRole.useCase";
import { GetRoleUseCase } from "application/use-cases/role/getRole.useCase";
import { RoleRepository } from "infrastructure/repositories/role.repository";
import { PermissionRepository } from "infrastructure/repositories/permission.repository";
import { CatchAsyncError } from "utils/errors/async.handler";

const router = Router();
const permissionRepo = new PermissionRepository();
const roleRepo = new RoleRepository(permissionRepo);

router.post("/", CatchAsyncError(async (req: Request, res: Response) => {
  const useCase = new CreateRoleUseCase(roleRepo, permissionRepo);
  const role = await useCase.execute(req.body);
  res.status(201).json({ message: "Role created", data: role });
}));

router.get("/", CatchAsyncError(async (req: Request, res: Response) => {
  const useCase = new GetRoleUseCase(roleRepo);
  const roles = await useCase.executeAll();
  res.json({ data: roles });
}));

router.get("/:id", CatchAsyncError(async (req: Request, res: Response) => {
  const useCase = new GetRoleUseCase(roleRepo);
  const role = await useCase.execute(req.params.id);
  if (!role) return res.status(404).json({ error: "Role not found" });
  res.json({ data: role });
}));

export default router;