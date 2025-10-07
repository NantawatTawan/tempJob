import { AuthError, SupabaseClient, User } from "@supabase/supabase-js";
import { Credentials, CredentialsSchema } from "../schemas/auth.schema";
import { getZodErrorMessage } from "@/lib/helpers/zod.helper";
import { translateSupabaseAuthErrorMessage } from "../helpers/auth.helper";
import supabase from "@/lib/supabase";

export class AuthService {
  constructor(private readonly supabaseClient: SupabaseClient) {
    if (!this.supabaseClient)
      throw new Error("Supabase client is not initialized");
  }

  async signInWithEmailAndPassword(credentials: Credentials) {
    const { error: validationError } = CredentialsSchema.safeParse(credentials);

    if (validationError) throw new Error(getZodErrorMessage(validationError));

    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error)
      throw new Error(translateSupabaseAuthErrorMessage(error.message));

    return data;
  }

  async signUpWithEmailAndPassword(credentials: Credentials) {
    const { error: validationError } = CredentialsSchema.safeParse(credentials);

    if (validationError) throw new Error(getZodErrorMessage(validationError));

    const { data, error } = await this.supabaseClient.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error)
      throw new Error(translateSupabaseAuthErrorMessage(error.message));

    return data;
  }

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await this.supabaseClient.auth.getUser();

    if (error)
      throw new Error(translateSupabaseAuthErrorMessage(error.message));

    return user;
  }

  async signOut() {
    const { error } = await this.supabaseClient.auth.signOut();

    if (error)
      throw new Error(translateSupabaseAuthErrorMessage(error.message));
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to send password reset email");
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(
          this._translateUpdatePasswordErrorMessage(error.message)
        );
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private _translateUpdatePasswordErrorMessage(errorMessage: string): string {
    const defaultErrorMessage = "ล้มเหลวระหว่างการอัพเดตรหัสผ่าน";

    switch (errorMessage.toLowerCase()) {
      case "invalid_password":
        return "รหัสผ่านไม่ถูกต้อง";
      case "new password should be different from the old password.":
        return "รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านเดิม";
      default:
        return defaultErrorMessage;
    }
  }
}

export const authService = new AuthService(supabase);
