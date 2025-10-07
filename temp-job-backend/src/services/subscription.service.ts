import { SupabaseClient } from "@supabase/supabase-js";
import { Company } from "../models/company.model";
import { supabaseServiceClient } from "../configs/db.config";
import { Package } from "../models/package.model";
import { getLocalTimeZone, today } from "@internationalized/date";
import { UserInfo } from "../models/user.model";
import { Subscription } from "../models/subscription.model";

export class SubscriptionService {
  private _SUBSCRIPTION_TABLE = "subscriptions";

  constructor(private readonly supabaseClient: SupabaseClient) {
    if (!this.supabaseClient) {
      throw new Error("Supabase client is not initialized");
    }
  }

  async createNewSubscription(packageInfo: Package) {
    const { data, error } = await this.supabaseClient
      .from(this._SUBSCRIPTION_TABLE)
      .insert({
        expired_at: today(getLocalTimeZone())
          .add({
            months: packageInfo.life_span_in_months,
          })
          .toString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getSubscriptionById(
    subscriptionId: Subscription["id"]
  ): Promise<Subscription | null> {
    const { data, error } = await this.supabaseClient
      .from(this._SUBSCRIPTION_TABLE)
      .select("*")
      .eq("id", subscriptionId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

const subscriptionService = new SubscriptionService(supabaseServiceClient);

export default subscriptionService;
