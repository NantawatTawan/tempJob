import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceClient } from "../configs/db.config";
import { EducationMajor } from "../models/education-major.model";

export class EducationMajorService {
  private readonly _EDUCATION_MAJOR_TABLE = "education_major";
  constructor(private readonly supabaseClient: SupabaseClient) {
    if (!this.supabaseClient) {
      throw new Error("Supabase client is not initialized");
    }
  }

  async getAllEducationMajors(): Promise<EducationMajor[]> {
    const { data, error } = await this.supabaseClient
      .from(this._EDUCATION_MAJOR_TABLE)
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getEducationMajorById(id: string): Promise<EducationMajor> {
    const { data, error } = await this.supabaseClient
      .from(this._EDUCATION_MAJOR_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async createEducationMajor(
    educationMajor: EducationMajor
  ): Promise<EducationMajor> {
    const { data, error } = await this.supabaseClient
      .from(this._EDUCATION_MAJOR_TABLE)
      .insert(educationMajor)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async updateEducationMajor(
    id: EducationMajor["id"],
    educationMajor: Partial<Omit<EducationMajor, "id">>
  ): Promise<EducationMajor> {
    const { data, error } = await this.supabaseClient
      .from(this._EDUCATION_MAJOR_TABLE)
      .update(educationMajor)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async deleteEducationMajor(
    id: EducationMajor["id"]
  ): Promise<EducationMajor> {
    const { data, error } = await this.supabaseClient
      .from(this._EDUCATION_MAJOR_TABLE)
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

export const educationMajorService = new EducationMajorService(
  supabaseServiceClient
);
