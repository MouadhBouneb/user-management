import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { User } from "../../domain/entities/user";
import { Email } from "../../domain/value-objects/email";
import { Password } from "../../domain/value-objects/password";
import ErrorHandler from "../../utils/errors/error.handler";
import { CatchAsyncError } from "../../utils/errors/async.handler";
import { CreateUserDto, UpdateUserDto } from "application/dto/user.dto";
import { mapper } from "infrastructure/mappers/autoMapper";

const userRepo = new UserRepository();

export const createUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const createUserDto = req.body as CreateUserDto;

    // Check if user exists
    const existing = await userRepo.findByEmail(createUserDto.email);
    if (existing) return next(new ErrorHandler("Email already exists", 400));
    const user = await mapper.mapAsync(createUserDto, CreateUserDto, User);
    const savedUser = await userRepo.save(user);
    res.status(201).json({ message: "User created", data: savedUser });
  }
);

export const getUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userRepo.findById(req.params.id);
    if (!user) return next(new ErrorHandler("User not found", 404));
    return res.json(user);
  }
);

export const updateUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userExist = await userRepo.findById(req.params.id);
    if (!userExist) return next(new ErrorHandler("User not found", 404));
    const updateUserDto = req.body as UpdateUserDto;

    const user = await mapper.mapAsync(updateUserDto, UpdateUserDto, User);
    await userRepo.update(user);
    return res.json({ message: "User updated", data: user });
  }
);

export const deleteUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    await userRepo.delete(req.params.id);
    return res.json({ message: "User deleted" });
  }
);
