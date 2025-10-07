import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceClient } from "../configs/db.config";
import { EducationLevel } from "../models/education-level.model";

export class EducationLevelService {
  private readonly _EDUCATION_LEVEL_TABLE = "education_level";

  constructor(private readonly supabaseClient: SupabaseClient) {
    if (!supabaseClient) {
      throw new Error("Supabase client is required");
    }
  }

  async getAllEducationLevels(): Promise<EducationLevel[]> {
    const { data, error } = await this.supabaseClient
      .from(this._EDUCATION_LEVEL_TABLE)
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getEducationLevelById(educationLevelId: EducationLevel["id"]) {
    const { data, error } = await this.supabaseClient
      .from(this._EDUCATION_LEVEL_TABLE)
      .select("*")
      .eq("id", educationLevelId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

export const educationLevelService = new EducationLevelService(
  supabaseServiceClient
);
