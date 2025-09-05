import { IUserRepository } from "domain/repositories/iUserRepository";
import { Email } from "domain/value-objects/email";
import { Password } from "domain/value-objects/password";
import { User } from "domain/entities/user";
import { v4 as uuidv4 } from "uuid";
import { RegisterUserDTO } from "application/dto/auth.dto";

export class RegisterUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(registerUserDTO: RegisterUserDTO): Promise<User> {
    const existing = await this.userRepo.findByEmail(registerUserDTO.email);
    if (existing) throw new Error("Email already exists");

    const email = Email.create(registerUserDTO.email);
    const password = await Password.create(registerUserDTO.password);

    const user = new User(
      uuidv4(),
      email,
      password,
      registerUserDTO.firstName,
      registerUserDTO.lastName
    );

    await this.userRepo.save(user);
    return user;
  }
}
