import { connectDB } from "./database";
import { SeedService } from "application/services/seed.service";
import { PermissionRepository } from "infrastructure/repositories/permission.repository";
import { RoleRepository } from "infrastructure/repositories/role.repository";
import { UserRepository } from "infrastructure/repositories/user.repository";

async function runSeed() {
  try {
    await connectDB();
    
    const permissionRepo = new PermissionRepository();
    const roleRepo = new RoleRepository(permissionRepo);
    const userRepo = new UserRepository();
    
    const seedService = new SeedService(permissionRepo, roleRepo, userRepo);
    await seedService.seedAll();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeed();