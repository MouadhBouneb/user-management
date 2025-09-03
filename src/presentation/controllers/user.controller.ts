import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { RoleRepository } from "../../infrastructure/repositories/role.repository";
import { PermissionRepository } from "../../infrastructure/repositories/permission.repository";
import { User } from "../../domain/entities/user";
import { Email } from "../../domain/value-objects/email";
import { Password } from "../../domain/value-objects/password";
import ErrorHandler from "../../utils/errors/error.handler";
import { CatchAsyncError } from "../../utils/errors/async.handler";
import { CreateUserDto, UpdateUserDto } from "application/dto/user.dto";
import { CreateUserUseCase } from "application/use-cases/user/createUser.useCase";
import { GetUserByIdUseCase } from "application/use-cases/user/getUserById.useCase";
import { UpdateUserUseCase } from "application/use-cases/user/updateUser.useCase";
import { DeleteUserUseCase } from "application/use-cases/user/deleteUser.useCase";

const userRepo = new UserRepository();
const roleRepo = new RoleRepository();
const permissionRepo = new PermissionRepository();

export const createUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const createUserDto = req.body as CreateUserDto;

    // Check if user exists
    const existing = await userRepo.findByEmail(createUserDto.email);
    if (existing) return next(new ErrorHandler("Email already exists", 400));
    
    const useCase = new CreateUserUseCase(userRepo, roleRepo, permissionRepo);
    const savedUser = await useCase.execute(createUserDto);
    res.status(201).json({ message: "User created", data: savedUser });
  }
);

export const getUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const useCase = new GetUserByIdUseCase(userRepo);
    const user = await useCase.execute(req.params.id);
    if (!user) return next(new ErrorHandler("User not found", 404));
    return res.json(user);
  }
);

export const updateUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const useCase = new UpdateUserUseCase(userRepo);
    const updatedUser = await useCase.execute(req.params.id, req.body);
    return res.json({ message: "User updated", data: updatedUser });
  }
);

export const deleteUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const useCase = new DeleteUserUseCase(userRepo);
    await useCase.execute(req.params.id);
    return res.json({ message: "User deleted" });
  }
);
