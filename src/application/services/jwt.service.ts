import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "config/env";
import { User } from "../../domain/entities/user";

type Payload = Record<string, any>;

export class JwtService {
  signAccess(user: User): string {
    return jwt.sign({ id: user.id }, env.JWT_ACCESS_TOKEN, {
      expiresIn: parseInt(env.JWT_ACCESS_EXPIRES_IN),
    });
  }

  signRefresh(user: User): string {
    return jwt.sign({ id: user.id }, env.JWT_REFRESH_TOKEN, {
      expiresIn: parseInt(env.JWT_REFRESH_EXPIRES_IN),
    });
  }

  verify<T>(token: string, type: "access" | "refresh" = "access"): T {
    const secret =
      type === "access" ? env.JWT_ACCESS_TOKEN : env.JWT_REFRESH_TOKEN;
    return jwt.verify(token, secret) as T;
  }
}
