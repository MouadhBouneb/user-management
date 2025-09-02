import { Role } from "../entities/role";

export interface IRoleRepository {
  create(role: Role): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  update(role: Role): Promise<Role>;
  delete(id: string): Promise<void>;
}
