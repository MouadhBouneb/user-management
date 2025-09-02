import { Email } from "domain/value-objects/email";

describe('Email Value Object', () => {
  it('should create valid email', () => {
    const email = Email.create('test@example.com');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should convert email to lowercase', () => {
    const email = Email.create('TEST@EXAMPLE.COM');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should throw error for invalid email format', () => {
    expect(() => Email.create('invalid-email')).toThrow('Invalid email format');
    expect(() => Email.create('test@')).toThrow('Invalid email format');
    expect(() => Email.create('@example.com')).toThrow('Invalid email format');
  });

  it('should accept valid email formats', () => {
    expect(() => Email.create('user@domain.com')).not.toThrow();
    expect(() => Email.create('user.name@domain.co.uk')).not.toThrow();
    expect(() => Email.create('user+tag@domain.org')).not.toThrow();
  });
});