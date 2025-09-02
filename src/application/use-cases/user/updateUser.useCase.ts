import { User } from "domain/entities/user";
import { IUserRepository } from "domain/repositories/iUserRepository";
import { UpdateUserDto } from "application/dto/user.dto";

export class UpdateUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error("User not found");

    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    if (dto.phone) user.phone = dto.phone;
    if (dto.avatar) user.avatar = dto.avatar;

    return await this.userRepo.update(user);
  }
}