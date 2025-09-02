import dotenv from "dotenv";

dotenv.config();
// Basic validation to ensure critical variables are set
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}
export const env = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: requireEnv("MONGO_URI"),
  JWT_ACCESS_TOKEN: requireEnv("JWT_ACCESS_TOKEN"),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "1",
  JWT_REFRESH_TOKEN: requireEnv("JWT_REFRESH_TOKEN"),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "1",
};
