import { LoginUserDTO } from "application/dto/auth.dto";
import { JwtService } from "application/services/jwt.service";
import { IUserRepository } from "domain/repositories/iUserRepository";

export class LoginUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(input: LoginUserDTO): Promise<{ token: string }> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) throw new Error("Invalid credentials");

    const matched = await user.password.compare(input.password);
    if (!matched) throw new Error("Invalid credentials");

    const token = this.jwtService.signAccess(user);
    return { token };
  }
}
