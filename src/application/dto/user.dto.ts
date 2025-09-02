import { User } from "domain/entities/user";
import { PermissionDto } from "./permission.dto";
import { RoleDto } from "./role.dto";

export function toUserDocumentDto(doc: any): User {
  return new User(
    doc._id.toString(),
    doc.email, // Should be Email instance
    doc.password, // Should be Password instance
    doc.firstName,
    doc.lastName,
    doc.avatar,
    doc.phone,
    doc.roles ?? [],
    doc.permissions ?? []
  );
}

export class CreateUserDto {
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  phone?: string;
  avatar?: string;
  roles?: RoleDto[];
  permissions?: PermissionDto[];
}

export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  roles?: RoleDto[];
  permissions?: PermissionDto[];
  password?: string;
}

export class UserDto {
  id!: string;
  email!: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  roles!: RoleDto[];
  permissions!: PermissionDto[];
}
