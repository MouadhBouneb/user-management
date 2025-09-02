import { Password } from "domain/value-objects/password";

describe('Password Value Object', () => {
  it('should create password with valid length', async () => {
    const password = await Password.create('password123');
    expect(password.getValue()).toBeDefined();
    expect(password.getValue().length).toBeGreaterThan(10); // bcrypt hash
  });

  it('should throw error for short password', async () => {
    await expect(Password.create('123')).rejects.toThrow('Password too short');
  });

  it('should compare passwords correctly', async () => {
    const password = await Password.create('password123');
    expect(await password.compare('password123')).toBe(true);
    expect(await password.compare('wrongpassword')).toBe(false);
  });

  it('should create password from existing hash', () => {
    const hash = '$2a$12$hashedpassword';
    const password = Password.fromHash(hash);
    expect(password.getValue()).toBe(hash);
  });
});