import { Role } from "domain/entities/role";
import { IRoleRepository } from "domain/repositories/iRoleRepository";

export class GetRoleUseCase {
  constructor(private roleRepo: IRoleRepository) {}

  async execute(id: string): Promise<Role | null> {
    return await this.roleRepo.findById(id);
  }

  async executeByName(name: string): Promise<Role | null> {
    return await this.roleRepo.findByName(name);
  }

  async executeAll(): Promise<Role[]> {
    return await this.roleRepo.findAll();
  }
}