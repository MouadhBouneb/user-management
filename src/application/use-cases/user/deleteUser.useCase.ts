import { IUserRepository } from "domain/repositories/iUserRepository";

export class DeleteUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error("User not found");
    
    await this.userRepo.delete(id);
  }
}