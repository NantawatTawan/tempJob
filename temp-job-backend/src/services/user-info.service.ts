import { SupabaseClient, User } from "@supabase/supabase-js";
import { supabaseServiceClient } from "../configs/db.config";
import { UserInfo, USER_ROLES } from "../models/user.model";
import { translateSupabaseErrorMessage } from "../helpers/supabase.helper";

class UserInfoService {
  private _USER_INFO_TABLE = "user_info";

  constructor(private readonly supabaseClient: SupabaseClient) {
    if (!supabaseClient) throw new Error("Supabase client is required");
  }

  async createNewUserByAdmin(
    email: User["email"],
    password: string
  ): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await this.supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error)
      throw new Error(
        translateSupabaseErrorMessage("ข้อมูลผู้ใช้งาน", error.message)
      );

    return user;
  }

  async createNewUserInfo(userId: string, role: USER_ROLES): Promise<UserInfo> {
    const { data, error } = await this.supabaseClient
      .from(this._USER_INFO_TABLE)
      .insert({ id: userId, role })
      .select()
      .single();

    if (error)
      throw new Error(
        translateSupabaseErrorMessage("ข้อมูลผู้ใช้งาน", error.message)
      );

    return data;
  }

  async getUserInfoByUserId(userId: string): Promise<UserInfo> {
    const { data, error } = await this.supabaseClient
      .from(this._USER_INFO_TABLE)
      .select("*")
      .eq("id", userId)
      .single();

    if (error)
      throw new Error(
        translateSupabaseErrorMessage("ข้อมูลผู้ใช้งาน", error.message)
      );

    return data;
  }
}

const userInfoService = new UserInfoService(supabaseServiceClient);

export default userInfoService;
