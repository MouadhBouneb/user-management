import { User } from "../entities/user";
import { PermissionService } from "./permisssionService";

export class AuthorizationService {
  constructor(private permissionService: PermissionService) {}

  async canPerformAction(user: User, action: string): Promise<boolean> {
    // Admin users can perform any action
    if (user.roles.some(role => role.name === 'admin')) {
      return true;
    }

    // Check specific permission
    return await this.permissionService.userHasPermission(user, action);
  }

  async requirePermission(user: User, action: string): Promise<void> {
    const hasPermission = await this.canPerformAction(user, action);
    if (!hasPermission) {
      throw new Error(`Access denied: missing permission '${action}'`);
    }
  }
}