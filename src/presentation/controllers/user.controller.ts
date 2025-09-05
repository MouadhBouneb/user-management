import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { RoleRepository } from "../../infrastructure/repositories/role.repository";
import { PermissionRepository } from "../../infrastructure/repositories/permission.repository";
import { User } from "../../domain/entities/user";
import { Email } from "../../domain/value-objects/email";
import { Password } from "../../domain/value-objects/password";
import ErrorHandler from "../../utils/errors/error.handler";
import {
  CatchAsyncError,
  AsyncController,
} from "../../utils/errors/async.handler";
import { CreateUserDto, UpdateUserDto } from "application/dto/user.dto";
import { CreateUserUseCase } from "application/use-cases/user/createUser.useCase";
import { GetUserByIdUseCase } from "application/use-cases/user/getUserById.useCase";
import { UpdateUserUseCase } from "application/use-cases/user/updateUser.useCase";
import { DeleteUserUseCase } from "application/use-cases/user/deleteUser.useCase";
import { logger as Logger } from "shared/services/logger.service";

// Repository instances
const permissionRepo = new PermissionRepository();
const roleRepo = new RoleRepository(permissionRepo);
const userRepo = new UserRepository();

/**
 * Create a new user
 * POST /api/v1/users
 */
export const createUserController = AsyncController(async (req: Request) => {
  const createUserDto = req.body as CreateUserDto;

  // Validate input
  if (
    !createUserDto.email ||
    !createUserDto.password ||
    !createUserDto.firstName ||
    !createUserDto.lastName
  ) {
    throw new ErrorHandler(
      "Missing required fields: email, password, firstName, lastName",
      400
    );
  }

  // Check if user exists
  const existing = await userRepo.findByEmail(createUserDto.email);
  if (existing) {
    Logger.warn(
      `Attempt to create duplicate user with email: ${createUserDto.email}`
    );
    throw new ErrorHandler("Email already exists", 409); // 409 Conflict
  }

  const useCase = new CreateUserUseCase(userRepo, roleRepo, permissionRepo);
  const savedUser = await useCase.execute(createUserDto);

  // Remove sensitive data from response
  const { password, ...userWithoutPassword } = savedUser;

  return {
    message: "User created successfully",
    data: userWithoutPassword,
  };
});

/**
 * Get a user by ID
 * GET /api/v1/users/:id
 */
export const getUserController = AsyncController(async (req: Request) => {
  const { id } = req.params;

  if (!id) {
    throw new ErrorHandler("User ID is required", 400);
  }

  const useCase = new GetUserByIdUseCase(userRepo);
  const user = await useCase.execute(id);

  if (!user) {
    throw new ErrorHandler(`User with ID ${id} not found`, 404);
  }

  // Remove sensitive data from response
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
});

/**
 * Update a user
 * PUT /api/v1/users/:id
 */
export const updateUserController = AsyncController(async (req: Request) => {
  const { id } = req.params;
  const updateData = req.body as UpdateUserDto;

  if (!id) {
    throw new ErrorHandler("User ID is required", 400);
  }

  // Prevent updating password through this endpoint for security
  if (updateData.password) {
    throw new ErrorHandler(
      "Password updates must go through the password reset endpoint",
      400
    );
  }

  const useCase = new UpdateUserUseCase(userRepo);
  const updatedUser = await useCase.execute(id, updateData);

  if (!updatedUser) {
    throw new ErrorHandler(`User with ID ${id} not found`, 404);
  }

  // Remove sensitive data from response
  const { password, ...userWithoutPassword } = updatedUser;

  return {
    message: "User updated successfully",
    data: userWithoutPassword,
  };
});

/**
 * Delete a user
 * DELETE /api/v1/users/:id
 */
export const deleteUserController = AsyncController(async (req: Request) => {
  const { id } = req.params;

  if (!id) {
    throw new ErrorHandler("User ID is required", 400);
  }

  const useCase = new DeleteUserUseCase(userRepo);
  const deleted = await useCase.execute(id);

  if (!deleted) {
    throw new ErrorHandler(`User with ID ${id} not found`, 404);
  }

  return {
    message: "User deleted successfully",
  };
});
