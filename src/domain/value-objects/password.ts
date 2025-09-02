import bcrypt from "bcryptjs";

export class Password {
  private constructor(private readonly value: string) {}

  static async create(raw: string): Promise<Password> {
    if (raw.length < 6) throw new Error("Password too short");
    const hash = await bcrypt.hash(raw, 12);
    return new Password(hash);
  }

  static fromHash(hash: string): Password {
    return new Password(hash);
  }

  async compare(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.value);
  }

  getValue(): string {
    return this.value;
  }
}
