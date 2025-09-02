import { Router, Request, Response } from "express";
import { LoginUserUseCase } from "application/use-cases/auth/loginUser.useCase";
import { RegisterUserUseCase } from "application/use-cases/auth/registerUser.useCase";
import { UserRepository } from "infrastructure/repositories/user.repository";
import { JwtService } from "application/services/jwt.service";
import { validateBody } from "shared/middleware/validation.middleware";
import { registerSchema, loginSchema } from "shared/validation/auth.validation";

const router = Router();
const userRepo = new UserRepository();
const jwtService = new JwtService();

router.post("/register", validateBody(registerSchema), async (req: Request, res: Response) => {
  try {
    const useCase = new RegisterUserUseCase(userRepo);
    const user = await useCase.execute(req.body);
    res.status(201).json({ id: user.id, email: user.email.getValue() });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", validateBody(loginSchema), async (req: Request, res: Response) => {
  try {
    const useCase = new LoginUserUseCase(userRepo, jwtService);
    const result = await useCase.execute(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
