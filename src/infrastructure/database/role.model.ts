import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRoleDoc extends Document {
  _id: Types.ObjectId;
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
