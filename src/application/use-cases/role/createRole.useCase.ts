import { Role } from "domain/entities/role";
import { IRoleRepository } from "domain/repositories/iRoleRepository";
import { IPermissionRepository } from "domain/repositories/iPermissionRepositroy";
import { CreateRoleDto } from "application/dto/role.dto";
import { v4 as uuidv4 } from "uuid";

export class CreateRoleUseCase {
  constructor(
    private roleRepo: IRoleRepository,
    private permissionRepo: IPermissionRepository
  ) {}

  async execute(dto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepo.findByName(dto.name);
    if (existing) throw new Error("Role already exists");

    const permissions = [];
    if (dto.permissions) {
      for (const permId of dto.permissions) {
        const permission = await this.permissionRepo.findById(permId);
        if (permission) permissions.push(permission);
      }
    }

    const role = new Role(uuidv4(), dto.name, permissions);
    return await this.roleRepo.create(role);
  }
}