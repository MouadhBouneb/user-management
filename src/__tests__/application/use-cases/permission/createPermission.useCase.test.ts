import { CreatePermissionUseCase } from "application/use-cases/permission/createPermission.useCase";
import { PermissionRepository } from "infrastructure/repositories/permission.repository";
import { CreatePermissionDto } from "application/dto/permission.dto";
import { Permission } from "domain/entities/permission";

describe('CreatePermissionUseCase', () => {
  let useCase: CreatePermissionUseCase;
  let permissionRepo: jest.Mocked<PermissionRepository>;

  beforeEach(() => {
    permissionRepo = {
      create: jest.fn(),
      findByName: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<PermissionRepository>;
    
    useCase = new CreatePermissionUseCase(permissionRepo);
  });

  it('should create a new permission successfully', async () => {
    const createDto: CreatePermissionDto = {
      action: 'user:create',
      description: 'Create new users'
    };

    permissionRepo.findByName.mockResolvedValue(null);
    permissionRepo.create.mockImplementation(async (permission) => permission);

    const result = await useCase.execute(createDto);

    expect(result.action).toBe('user:create');
    expect(result.description).toBe('Create new users');
    expect(permissionRepo.findByName).toHaveBeenCalledWith('user:create');
    expect(permissionRepo.create).toHaveBeenCalled();
  });

  it('should throw error if permission already exists', async () => {
    const createDto: CreatePermissionDto = {
      action: 'user:create',
      description: 'Create new users'
    };

    const existingPermission = new Permission('1', 'user:create', 'Existing');
    permissionRepo.findByName.mockResolvedValue(existingPermission);

    await expect(useCase.execute(createDto)).rejects.toThrow('Permission already exists');
  });
});