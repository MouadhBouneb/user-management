import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface IUserDoc extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  roles: string[];
  permissions: string[];
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

const UserSchema = new Schema<IUserDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String },
    phone: { type: String },
    roles: [{ type: String, ref: "Role" }],
    permissions: [{ type: String, ref: "Permission" }],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

/**
 * Middleware: Hash password before saving
 */
UserSchema.pre<IUserDoc>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Middleware: Update passwordChangedAt when password is modified
 */
UserSchema.pre<IUserDoc>("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000); // -1s to prevent token issues
  next();
});
/**
 * Method: Compare candidate password with hashed password
 */
UserSchema.methods.correctPassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
/**
 * Method: Generate password reset token
 */
UserSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};
export const UserModel = mongoose.model<IUserDoc>("User", UserSchema);
