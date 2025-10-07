import { config } from "dotenv";

config();

export const env = {
  PORT: process.env.PORT,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
};
