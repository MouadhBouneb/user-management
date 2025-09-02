import { RegisterUserUseCase } from "application/use-cases/auth/registerUser.useCase";
import { UserRepository } from "infrastructure/repositories/user.repository";
import { RegisterUserDTO } from "application/dto/auth.dto";

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;
    
    useCase = new RegisterUserUseCase(userRepo);
  });

  it('should register a new user successfully', async () => {
    const registerDto: RegisterUserDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    userRepo.findByEmail.mockResolvedValue(null);
    userRepo.save.mockImplementation(async (user) => user);

    const result = await useCase.execute(registerDto);

    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
    expect(result.email.getValue()).toBe('john@example.com');
    expect(userRepo.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(userRepo.save).toHaveBeenCalled();
  });

  it('should throw error if email already exists', async () => {
    const registerDto: RegisterUserDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    userRepo.findByEmail.mockResolvedValue({} as any);

    await expect(useCase.execute(registerDto)).rejects.toThrow('Email already exists');
  });
});