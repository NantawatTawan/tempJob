import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceClient } from "../configs/db.config";
import { Advertisement } from "../models/advertisement.model";

export class AdvertisementService {
  private readonly _ADVERTISEMENT_TABLE = "advertisement";

  constructor(private readonly supabaseClient: SupabaseClient) {}

  async getAllAdvertisements() {
    const { data, error } = await this.supabaseClient
      .from(this._ADVERTISEMENT_TABLE)
      .select("*");

    if (error) throw new Error(error.message);

    return data;
  }

  async getAdvertisementById(advertisementId: Advertisement["id"]) {
    const { data, error } = await this.supabaseClient
      .from(this._ADVERTISEMENT_TABLE)
      .select("*")
      .eq("id", advertisementId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async deleteAdvertisementById(advertisementId: Advertisement["id"]) {
    const { data, error } = await this.supabaseClient
      .from(this._ADVERTISEMENT_TABLE)
      .delete()
      .eq("id", advertisementId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async createNewAdvertisement(advertisement: Omit<Advertisement, "id">) {
    const { data, error } = await this.supabaseClient
      .from(this._ADVERTISEMENT_TABLE)
      .insert(advertisement)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async updateAdvertisementById(
    advertisementId: Advertisement["id"],
    advertisement: Partial<Omit<Advertisement, "id">>
  ) {
    const { data, error } = await this.supabaseClient
      .from(this._ADVERTISEMENT_TABLE)
      .update(advertisement)
      .eq("id", advertisementId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }
}

const advertisementService = new AdvertisementService(supabaseServiceClient);

export default advertisementService;
