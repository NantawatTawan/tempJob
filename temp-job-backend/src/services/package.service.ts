import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceClient } from "../configs/db.config";
import { Package } from "../models/package.model";
import { Company } from "../models/company.model";

export class PackageService {
  private _PACKAGE_TABLE = "packages";

  constructor(private readonly supabaseClient: SupabaseClient) {
    if (!supabaseClient) {
      throw new Error("Supabase client is required");
    }
  }

  async getAllPackages() {
    const { data: packages, error } = await this.supabaseClient
      .from(this._PACKAGE_TABLE)
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return packages;
  }

  async getPackageById(packageId: Package["id"]): Promise<Package | null> {
    const { data: packageInfo, error } = await this.supabaseClient
      .from(this._PACKAGE_TABLE)
      .select("*")
      .eq("id", packageId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return packageInfo;
  }

}

const packageService = new PackageService(supabaseServiceClient);

export default packageService;
