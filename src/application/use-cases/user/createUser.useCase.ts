import { UserRepository } from "infrastructure/repositories/user.repository";
import { RoleRepository } from "infrastructure/repositories/role.repository";
import { PermissionRepository } from "infrastructure/repositories/permission.repository";
import { User } from "domain/entities/user";
import { Email } from "domain/value-objects/email";
import { Password } from "domain/value-objects/password";
import { v4 as uuidv4 } from "uuid";
import { CreateUserDto } from "application/dto/user.dto";

export class CreateUserUseCase {
  constructor(
    private userRepo: UserRepository,
    private roleRepo: RoleRepository,
    private permissionRepo: PermissionRepository
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findByEmail(createUserDto.email);
    if (existing) throw new Error("Email already exists");
    
    const email = Email.create(createUserDto.email);
    const password = await Password.create(createUserDto.password);
    
    // Fetch Role entities from IDs
    const roles = [];
    if (createUserDto.roles) {
      for (const roleDto of createUserDto.roles) {
        const role = await this.roleRepo.findById(roleDto.id);
        if (role) roles.push(role);
      }
    }
    
    // Fetch Permission entities from IDs
    const permissions = [];
    if (createUserDto.permissions) {
      for (const permissionDto of createUserDto.permissions) {
        const permission = await this.permissionRepo.findById(permissionDto.id);
        if (permission) permissions.push(permission);
      }
    }
    
    const user = new User(
      uuidv4(),
      email,
      password,
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.avatar,
      createUserDto.phone,
      roles,
      permissions
    );
    
    await this.userRepo.save(user);
    return user;
  }
}
