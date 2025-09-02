import { User } from "domain/entities/user";
import { IUserRepository } from "domain/repositories/iUserRepository";
import { UserModel } from "../database/user.model";
import { toUserDocumentDto } from "application/dto/user.dto";

export class UserRepository implements IUserRepository {
  async update(user: User): Promise<User> {
    const doc = await UserModel.findByIdAndUpdate(
      user.id,
      {
        email: user.email.getValue(),
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        phone: user.phone,
        roles: user.roles.map(r => r.id),
        permissions: user.permissions.map(p => p.id),
      },
      { new: true }
    );
    if (!doc) throw new Error("User not found");
    return toUserDocumentDto(doc);
  }
  
  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
  async save(user: User): Promise<User> {

    const doc = await UserModel.findOneAndUpdate(
      { email: user.email.getValue() },
      { 
        email: user.email.getValue(),
        password: user.password.getValue(),
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        phone: user.phone,
        roles: user.roles.map(r => r.id),
        permissions: user.permissions.map(p => p.id),
      },
      { upsert: true, new: true }
    );
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean();
    if (!doc) return null;
    return toUserDocumentDto(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean();
    if (!doc) return null;
    return toUserDocumentDto(doc);
  }
}
