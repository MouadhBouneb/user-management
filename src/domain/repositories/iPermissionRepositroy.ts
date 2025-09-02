import { Permission } from "../entities/permission";

export interface IPermissionRepository {
  create(permission: Permission): Promise<Permission>;
  findById(id: string): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  update(permission: Permission): Promise<Permission>;
  delete(id: string): Promise<void>;
}
