import { Permission } from "domain/entities/permission";
import { IPermissionRepository } from "domain/repositories/iPermissionRepositroy";
import { CreatePermissionDto } from "application/dto/permission.dto";
import { v4 as uuidv4 } from "uuid";

export class CreatePermissionUseCase {
  constructor(private permissionRepo: IPermissionRepository) {}

  async execute(dto: CreatePermissionDto): Promise<Permission> {
    const existing = await this.permissionRepo.findByName(dto.action);
    if (existing) throw new Error("Permission already exists");

    const permission = new Permission(
      uuidv4(),
      dto.action,
      dto.description
    );

    return await this.permissionRepo.create(permission);
  }
}