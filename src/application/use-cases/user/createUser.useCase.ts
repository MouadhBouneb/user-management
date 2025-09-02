import { UserRepository } from "infrastructure/repositories/user.repository";
import { User } from "domain/entities/user";
import { Email } from "domain/value-objects/email";
import { Password } from "domain/value-objects/password";
import { v4 as uuidv4 } from "uuid";
import { CreateUserDto } from "application/dto/user.dto";
import { mapper } from "infrastructure/mappers/autoMapper";

export class CreateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findByEmail(createUserDto.email);
    if (existing) throw new Error("Email already exists");
    let user = await mapper.mapAsync(createUserDto, CreateUserDto, User);
    await this.userRepo.save(user);
    return user;
  }
}
