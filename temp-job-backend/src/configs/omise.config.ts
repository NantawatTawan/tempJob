import { config } from "dotenv";
import { OmiseClient } from "omise-nodejs";

config();

export const Omise = new OmiseClient({
  secretKey: process.env.OMISE_SECRET_KEY!,
  publicKey: process.env.OMISE_PUBLIC_KEY!,
});
