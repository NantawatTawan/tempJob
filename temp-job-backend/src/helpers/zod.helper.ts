import { ZodError } from "zod";

export function getZodErrorMessage(zodError: ZodError) {
  return zodError.errors[0].message;
}
