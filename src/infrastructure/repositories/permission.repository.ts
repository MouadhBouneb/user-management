import { Permission } from "domain/entities/permission";
import { IPermissionRepository } from "domain/repositories/iPermissionRepositroy";
import { PermissionModel } from "../database/permission.model";

export class PermissionRepository implements IPermissionRepository {
  async create(permission: Permission): Promise<Permission> {
    const doc = await PermissionModel.create({
      _id: permission.id,
      action: permission.action,
      description: permission.description,
    });
    return new Permission(doc._id.toString(), doc.action, doc.description);
  }

  async findById(id: string): Promise<Permission | null> {
    const doc = await PermissionModel.findById(id).lean();
    if (!doc) return null;
    return new Permission(doc._id.toString(), doc.action, doc.description);
  }

  async findByName(action: string): Promise<Permission | null> {
    const doc = await PermissionModel.findOne({ action }).lean();
    if (!doc) return null;
    return new Permission(doc._id.toString(), doc.action, doc.description);
  }

  async update(permission: Permission): Promise<Permission> {
    const doc = await PermissionModel.findByIdAndUpdate(
      permission.id,
      {
        action: permission.action,
        description: permission.description,
      },
      { new: true }
    );
    if (!doc) throw new Error("Permission not found");
    return new Permission(doc._id.toString(), doc.action, doc.description);
  }

  async delete(id: string): Promise<void> {
    await PermissionModel.findByIdAndDelete(id);
  }

  async findAll(): Promise<Permission[]> {
    const docs = await PermissionModel.find().lean();
    return docs.map(doc => new Permission(doc._id.toString(), doc.action, doc.description));
  }
}