import { PermissionDto } from "./permission.dto";

export interface CreateRoleDto {
  name: string;
  permissions?: string[]; // Array of permission IDs
}

export interface UpdateRoleDto {
  name?: string;
  permissions?: string[];
}

export class RoleDto {
  id!: string;
  name!: string;
  permissions?: PermissionDto[];
}
