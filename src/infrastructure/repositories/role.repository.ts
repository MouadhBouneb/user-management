import { Role } from "domain/entities/role";
import { IRoleRepository } from "domain/repositories/iRoleRepository";
import { RoleModel } from "../database/role.model";
import { PermissionRepository } from "./permission.repository";

export class RoleRepository implements IRoleRepository {
  constructor(private permissionRepo: PermissionRepository) {}

  async create(role: Role): Promise<Role> {
    const doc = await RoleModel.create({
      name: role.name,
      permissions: role.permissions.map((p) => p.id),
    });
    return new Role(doc._id.toString(), doc.name, role.permissions);
  }

  async findById(id: string): Promise<Role | null> {
    const doc = await RoleModel.findById(id).lean();
    if (!doc) return null;

    const permissions = await Promise.all(
      doc.permissions.map((permId) => this.permissionRepo.findById(permId))
    );

    return new Role(
      doc._id.toString(),
      doc.name,
      permissions.filter((p) => p !== null)
    );
  }

  async findByName(name: string): Promise<Role | null> {
    const doc = await RoleModel.findOne({ name }).lean();
    if (!doc) return null;

    const permissions = await Promise.all(
      doc.permissions.map((permId) => this.permissionRepo.findById(permId))
    );

    return new Role(
      doc._id.toString(),
      doc.name,
      permissions.filter((p) => p !== null)
    );
  }

  async update(role: Role): Promise<Role> {
    const doc = await RoleModel.findByIdAndUpdate(
      role.id,
      {
        name: role.name,
        permissions: role.permissions.map((p) => p.id),
      },
      { new: true }
    );
    if (!doc) throw new Error("Role not found");
    return new Role(doc._id.toString(), doc.name, role.permissions);
  }

  async delete(id: string): Promise<void> {
    await RoleModel.findByIdAndDelete(id);
  }

  async findAll(): Promise<Role[]> {
    const docs = await RoleModel.find().lean();
    const roles = await Promise.all(
      docs.map(async (doc) => {
        const permissions = await Promise.all(
          doc.permissions.map((permId) => this.permissionRepo.findById(permId))
        );
        return new Role(
          doc._id.toString(),
          doc.name,
          permissions.filter((p) => p !== null)
        );
      })
    );
    return roles;
  }
}
