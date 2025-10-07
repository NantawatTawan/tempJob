import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceClient } from "../configs/db.config";
import { Theme, ThemePurchase } from "../models/theme.model";
import { getLocalTimeZone, today } from "@internationalized/date";
import { StorageService } from "./storage.service";
import { Freelancer } from "../models/freelancer.model";
const THEME_BUCKET = "theme";

export class ThemeService {
  private _THEME_TABLE = "theme";
  private _THEME_PURCHASE_TABLE = "theme_purchase";
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly storageService: StorageService
  ) {
    if (!supabaseClient) throw new Error("Supabase client is required");
    if (!storageService) throw new Error("Storage service is required");
  }

  async getAllThemes(): Promise<Theme[]> {
    const { data: themes, error } = await this.supabaseClient
      .from(this._THEME_TABLE)
      .select("*");

    if (error) throw new Error(error.message);

    return themes;
  }

  async updateThemeByThemeId(
    themeId: Theme["id"],
    theme: Omit<Partial<Theme>, "id">
  ): Promise<Theme> {
    const { data, error } = await this.supabaseClient
      .from(this._THEME_TABLE)
      .update({ ...theme, updated_at: today(getLocalTimeZone()).toString() })
      .eq("id", themeId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async createNewTheme(theme: Partial<Theme>): Promise<Theme | null> {
    const { data, error } = await this.supabaseClient
      .from(this._THEME_TABLE)
      .insert(theme)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async deleteTheme(themeId: Theme["id"]): Promise<Theme> {
    const { data: deletedTheme, error } = await this.supabaseClient
      .from(this._THEME_TABLE)
      .delete()
      .eq("id", themeId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return deletedTheme;
  }

  async getThemeById(themeId: Theme["id"]): Promise<Theme> {
    const { data, error } = await this.supabaseClient
      .from(this._THEME_TABLE)
      .select("*")
      .eq("id", themeId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async deleteAllThemeImagesByThemeId(themeId: Theme["id"]): Promise<void> {
    await this.storageService.deleteAllFilesInFolder(`${themeId}`);
  }

  async getPurchasedThemesByFreelancerId(
    freelancerId: Freelancer["id"]
  ): Promise<ThemePurchase[]> {
    const { data: themes, error } = await this.supabaseClient
      .from(this._THEME_PURCHASE_TABLE)
      .select("*, theme(*), freelancer(*)")
      .eq("freelancer_id", freelancerId);

    if (error) throw new Error(error.message);

    return themes;
  }

  async purchaseTheme(
    themeId: Theme["id"],
    freelancerId: Freelancer["id"]
  ): Promise<ThemePurchase> {
    try {
      const { data, error } = await this.supabaseClient
        .from(this._THEME_PURCHASE_TABLE)
        .insert({ theme_id: themeId, freelancer_id: freelancerId })
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data;
    } catch (error: any) {
      throw new Error(`ล้มเหลวระหว่างซื้อธิีม -> ${error.message}`);
    }
  }
}

export const themeService = new ThemeService(
  supabaseServiceClient,
  new StorageService(THEME_BUCKET, supabaseServiceClient)
);
