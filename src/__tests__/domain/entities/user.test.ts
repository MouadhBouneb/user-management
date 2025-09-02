import { User } from "domain/entities/user";
import { Email } from "domain/value-objects/email";
import { Password } from "domain/value-objects/password";
import { Role } from "domain/entities/role";
import { Permission } from "domain/entities/permission";

describe('User Entity', () => {
  let user: User;
  let email: Email;
  let password: Password;

  beforeEach(async () => {
    email = Email.create('test@example.com');
    password = await Password.create('password123');
    user = new User('1', email, password, 'John', 'Doe');
  });

  describe('Role Management', () => {
    it('should assign a role to user', () => {
      const role = new Role('role1', 'Admin', []);
      user.assignRole(role);
      expect(user.roles).toContain(role);
    });

    it('should not assign duplicate roles', () => {
      const role = new Role('role1', 'Admin', []);
      user.assignRole(role);
      user.assignRole(role);
      expect(user.roles.length).toBe(1);
    });

    it('should remove a role from user', () => {
      const role = new Role('role1', 'Admin', []);
      user.assignRole(role);
      user.removeRole('role1');
      expect(user.roles).not.toContain(role);
    });
  });

  describe('Permission Management', () => {
    it('should assign a permission to user', () => {
      const permission = new Permission('perm1', 'user:create');
      user.assignPermission(permission);
      expect(user.permissions).toContain(permission);
    });

    it('should not assign duplicate permissions', () => {
      const permission = new Permission('perm1', 'user:create');
      user.assignPermission(permission);
      user.assignPermission(permission);
      expect(user.permissions.length).toBe(1);
    });

    it('should check if user has permission', () => {
      const permission = new Permission('perm1', 'user:create');
      user.assignPermission(permission);
      expect(user.hasPermission('perm1')).toBe(true);
      expect(user.hasPermission('perm2')).toBe(false);
    });
  });
});