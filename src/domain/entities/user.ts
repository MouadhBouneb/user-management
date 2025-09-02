import { Email } from "../value-objects/email";
import { Password } from "../value-objects/password";
import { Permission } from "./permission";
import { Role } from "./role";

export class User {
  constructor(
    public id: string,
    public email: Email,
    public password: Password,
    public firstName: string,
    public lastName: string,
    public avatar?: string,
    public phone?: string,
    public roles: Role[] = [],
    public permissions: Permission[] = []
  ) {}

  assignRole(role: Role) {
    if (!this.roles.includes(role)) this.roles.push(role);
  }

  removeRole(roleId: string) {
    this.roles = this.roles.filter((r) => r.id !== roleId);
  }

  assignPermission(permission: Permission) {
    if (!this.permissions.includes(permission))
      this.permissions.push(permission);
  }

  removePermission(permissionId: string) {
    this.permissions = this.permissions.filter((p) => p.id !== permissionId);
  }

  hasPermission(permissionId: string): boolean {
    return this.permissions.some((p) => p.id === permissionId);
  }
}
