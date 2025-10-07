import { ZodError } from "zod";

export function getZodErrorMessage(zodError: ZodError<any>): string {
  return zodError.errors[0].message;
}
