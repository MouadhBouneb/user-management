export interface CreatePermissionDto {
  action: string; // e.g., "user:create"
  description?: string;
}

export interface UpdatePermissionDto {
  action?: string;
  description?: string;
}

export class PermissionDto {
  id!: string;
  action!: string;
  description?: string;
}
