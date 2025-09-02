import mongoose, { Schema, Document } from "mongoose";

export interface IRoleDoc extends Document {
  name: string;
  permissions: string[];
}

const RoleSchema = new Schema<IRoleDoc>(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String, ref: "Permission" }],
  },
  {
    timestamps: true,
  }
);

export const RoleModel = mongoose.model<IRoleDoc>("Role", RoleSchema);
