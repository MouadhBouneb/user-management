import { User } from "../entities/user";
import { IRoleRepository } from "../repositories/iRoleRepository";

class PermissionService {
  constructor(private roleRepo: IRoleRepository) {}

  async userHasPermission(user: User, permission: string): Promise<boolean> {
    // Check direct user permissions
    // Check permissions from roles
    return (
      user.permissions.includes(permission) ||
      user.roles.some((rolePerm) => rolePerm === permission)
    );
  }
}
