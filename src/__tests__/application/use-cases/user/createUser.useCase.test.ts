import { CreateUserUseCase } from "application/use-cases/user/createUser.useCase";
import { UserRepository } from "infrastructure/repositories/user.repository";
import { CreateUserDto } from "application/dto/user.dto";

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;
    
    useCase = new CreateUserUseCase(userRepo);
  });

  it('should create a new user successfully', async () => {
    const createDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    userRepo.findByEmail.mockResolvedValue(null);
    userRepo.save.mockImplementation(async (user) => user);

    const result = await useCase.execute(createDto);

    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
    expect(result.email.getValue()).toBe('john@example.com');
    expect(userRepo.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(userRepo.save).toHaveBeenCalled();
  });

  it('should throw error if email already exists', async () => {
    const createDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    userRepo.findByEmail.mockResolvedValue({} as any);

    await expect(useCase.execute(createDto)).rejects.toThrow('Email already exists');
  });
});