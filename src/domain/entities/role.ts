import { Permission } from "./permission";

export class Role {
  constructor(
    public id: string,
    public name: string,
    public permissions: Permission[]
  ) {}
  addPermission(permission: Permission) {
    if (!this.permissions.includes(permission))
      this.permissions.push(permission);
  }

  removePermission(permissionId: string) {
    this.permissions = this.permissions.filter((p) => p.id !== permissionId);
  }
}
