import { UserRepository } from "infrastructure/repositories/user.repository";
import { User } from "domain/entities/user";
import { Email } from "domain/value-objects/email";
import { Password } from "domain/value-objects/password";
import { v4 as uuidv4 } from "uuid";
import { CreateUserDto } from "application/dto/user.dto";

export class CreateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findByEmail(createUserDto.email);
    if (existing) throw new Error("Email already exists");
    
    const email = Email.create(createUserDto.email);
    const password = await Password.create(createUserDto.password);
    
    const user = new User(
      uuidv4(),
      email,
      password,
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.avatar,
      createUserDto.phone,
      createUserDto.roles || [],
      createUserDto.permissions || []
    );
    
    await this.userRepo.save(user);
    return user;
  }
}
