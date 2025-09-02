import { UserRepository } from "infrastructure/repositories/user.repository";
import { User } from "domain/entities/user";
import { Email } from "domain/value-objects/email";
import { Password } from "domain/value-objects/password";
import { UserModel } from "infrastructure/database/user.model";

describe('UserRepository', () => {
  let userRepo: UserRepository;
  let user: User;

  beforeEach(async () => {
    userRepo = new UserRepository();
    const email = Email.create('test@example.com');
    const password = await Password.create('password123');
    user = new User('1', email, password, 'John', 'Doe');
  });

  describe('save', () => {
    it('should save a new user', async () => {
      const savedUser = await userRepo.save(user);
      expect(savedUser.email.getValue()).toBe('test@example.com');
      expect(savedUser.firstName).toBe('John');
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      await userRepo.save(user);
      const foundUser = await userRepo.findByEmail('test@example.com');
      expect(foundUser).toBeTruthy();
      expect(foundUser?.email.getValue()).toBe('test@example.com');
    });

    it('should return null if user not found', async () => {
      const foundUser = await userRepo.findByEmail('nonexistent@example.com');
      expect(foundUser).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const savedUser = await userRepo.save(user);
      const foundUser = await userRepo.findById(savedUser.id);
      expect(foundUser).toBeTruthy();
      expect(foundUser?.firstName).toBe('John');
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const savedUser = await userRepo.save(user);
      savedUser.firstName = 'Jane';
      
      const updatedUser = await userRepo.update(savedUser);
      expect(updatedUser.firstName).toBe('Jane');
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const savedUser = await userRepo.save(user);
      await userRepo.delete(savedUser.id);
      
      const foundUser = await userRepo.findById(savedUser.id);
      expect(foundUser).toBeNull();
    });
  });
});