import { PermissionService } from "domain/services/permisssionService";
import { User } from "domain/entities/user";
import { Role } from "domain/entities/role";
import { Permission } from "domain/entities/permission";
import { Email } from "domain/value-objects/email";
import { Password } from "domain/value-objects/password";

describe('PermissionService', () => {
  let service: PermissionService;
  let user: User;

  beforeEach(async () => {
    service = new PermissionService();
    const email = Email.create('test@example.com');
    const password = await Password.create('password123');
    user = new User('1', email, password, 'John', 'Doe');
  });

  it('should return true for direct user permission', async () => {
    const permission = new Permission('1', 'user:create');
    user.assignPermission(permission);

    const result = await service.userHasPermission(user, 'user:create');
    expect(result).toBe(true);
  });

  it('should return true for role-based permission', async () => {
    const permission = new Permission('1', 'user:create');
    const role = new Role('1', 'Admin', [permission]);
    user.assignRole(role);

    const result = await service.userHasPermission(user, 'user:create');
    expect(result).toBe(true);
  });

  it('should return false for missing permission', async () => {
    const result = await service.userHasPermission(user, 'user:delete');
    expect(result).toBe(false);
  });
});