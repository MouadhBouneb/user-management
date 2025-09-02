import { User } from "domain/entities/user";
import { IUserRepository } from "domain/repositories/iUserRepository";
import { UserModel } from "../database/user.model";
import { toUserDocumentDto } from "application/dto/user.dto";

export class UserRepository implements IUserRepository {
  update(user: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async save(user: User): Promise<User> {
    console.log("user", user);
    console.log("Mapped user:", user, "Email value:", user.email.getValue());

    const doc = await UserModel.findOneAndUpdate(
      { email: user.email.getValue() },
      { ...user, email: user.email.getValue() },
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
