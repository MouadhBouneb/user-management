import mongoose, { Schema, Document } from "mongoose";

export interface IPermissionDoc extends Document {
  action: string; // like "USER_CREATE"
  description?: string;
}

const PermissionSchema = new Schema<IPermissionDoc>(
  {
    action: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export const PermissionModel = mongoose.model<IPermissionDoc>(
  "Permission",
  PermissionSchema
);
