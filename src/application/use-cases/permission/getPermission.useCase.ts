import { Permission } from "domain/entities/permission";
import { IPermissionRepository } from "domain/repositories/iPermissionRepositroy";

export class GetPermissionUseCase {
  constructor(private permissionRepo: IPermissionRepository) {}

  async execute(id: string): Promise<Permission | null> {
    return await this.permissionRepo.findById(id);
  }

  async executeByAction(action: string): Promise<Permission | null> {
    return await this.permissionRepo.findByName(action);
  }

  async executeAll(): Promise<Permission[]> {
    return await this.permissionRepo.findAll();
  }
}