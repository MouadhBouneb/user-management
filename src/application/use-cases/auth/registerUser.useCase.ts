import { IUserRepository } from "domain/repositories/iUserRepository";
import { Email } from "domain/value-objects/email";
import { Password } from "domain/value-objects/password";
import { User } from "domain/entities/user";
import { v4 as uuidv4 } from "uuid";
import { RegisterUserDTO } from "application/dto/auth.dto";
import { mapper } from "infrastructure/mappers/autoMapper";

export class RegisterUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(registerUserDTO: RegisterUserDTO): Promise<User> {
    const existing = await this.userRepo.findByEmail(registerUserDTO.email);
    if (existing) throw new Error("Email already exists");
    let user = await mapper.mapAsync(registerUserDTO, RegisterUserDTO, User);

    await this.userRepo.save(user);
    return user;
  }
}
