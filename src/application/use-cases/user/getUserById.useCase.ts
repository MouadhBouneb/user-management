import { User } from "domain/entities/user";
import { IUserRepository } from "domain/repositories/iUserRepository";

export class GetUserByIdUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(id: string): Promise<User | null> {
    return await this.userRepo.findById(id);
  }
}