import { User } from "../entities/user";

export class PermissionService {
  constructor() {}

  async userHasPermission(user: User, permission: string): Promise<boolean> {
    // Check direct user permissions
    const hasDirectPermission = user.permissions.some(p => p.action === permission);
    if (hasDirectPermission) return true;
    
    // Check permissions from roles
    const hasRolePermission = user.roles.some(role => 
      role.permissions.some(p => p.action === permission)
    );
    
    return hasRolePermission;
  }
}
