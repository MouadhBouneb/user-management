import { PermissionRepository } from "infrastructure/repositories/permission.repository";
import { RoleRepository } from "infrastructure/repositories/role.repository";
import { UserRepository } from "infrastructure/repositories/user.repository";
import { Permission } from "domain/entities/permission";
import { Role } from "domain/entities/role";
import { User } from "domain/entities/user";
import { Email } from "domain/value-objects/email";
import { Password } from "domain/value-objects/password";
import { PERMISSIONS } from "shared/constants/permissions";
import { ROLES } from "shared/constants/roles";
import { v4 as uuidv4 } from "uuid";

export class SeedService {
  constructor(
    private permissionRepo: PermissionRepository,
    private roleRepo: RoleRepository,
    private userRepo: UserRepository
  ) {}

  async seedPermissions(): Promise<Permission[]> {
    const permissions: Permission[] = [];

    for (const [key, action] of Object.entries(PERMISSIONS)) {
      const existing = await this.permissionRepo.findByName(action);
      if (!existing) {
        const permission = new Permission(
          uuidv4(),
          action,
          `Permission to ${action}`
        );
        console.log("permission", permission);
        await this.permissionRepo.create(permission);
        permissions.push(permission);
      }
    }

    return permissions;
  }

  async seedRoles(): Promise<Role[]> {
    const allPermissions = await this.permissionRepo.findAll();
    const roles: Role[] = [];

    // Admin role with all permissions
    const adminRole = new Role(uuidv4(), ROLES.ADMIN, allPermissions);
    const existingAdmin = await this.roleRepo.findByName(ROLES.ADMIN);
    if (!existingAdmin) {
      await this.roleRepo.create(adminRole);
      roles.push(adminRole);
    }

    // User role with basic permissions
    const userPermissions = allPermissions.filter(
      (p) => p.action.includes("read") || p.action === PERMISSIONS.USER_UPDATE
    );
    const userRole = new Role(uuidv4(), ROLES.USER, userPermissions);
    const existingUser = await this.roleRepo.findByName(ROLES.USER);
    if (!existingUser) {
      await this.roleRepo.create(userRole);
      roles.push(userRole);
    }

    return roles;
  }

  async seedAdminUser(): Promise<User | null> {
    const existing = await this.userRepo.findByEmail("admin@example.com");
    if (existing) return null;

    const adminRole = await this.roleRepo.findByName(ROLES.ADMIN);
    if (!adminRole) throw new Error("Admin role not found");

    const email = Email.create("admin@example.com");
    const password = await Password.create("admin123");

    const adminUser = new User(
      uuidv4(),
      email,
      password,
      "Admin",
      "User",
      undefined,
      undefined,
      [adminRole],
      []
    );

    return await this.userRepo.save(adminUser);
  }

  async seedAll(): Promise<void> {
    console.log("🌱 Starting database seeding...");

    await this.seedPermissions();
    console.log("✅ Permissions seeded");

    await this.seedRoles();
    console.log("✅ Roles seeded");

    await this.seedAdminUser();
    console.log("✅ Admin user seeded");

    console.log("🎉 Database seeding completed!");
  }
}
