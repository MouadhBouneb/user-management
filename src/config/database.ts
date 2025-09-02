// src/config/database.ts
import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    if (!env.MONGO_URI) {
      throw new Error("MongoDB URI not provided.");
    }
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
