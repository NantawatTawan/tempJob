import { BackendResponse } from "@/shared/types/api.type";
import { AxiosInstance } from "axios";
import { Package } from "../schemas/pacakge.schema";
import { StatusCodes } from "http-status-codes";
import backendClient from "@/lib/axios";
import { Company } from "@/features/company/schemas/company.schema";

class PackageService {
  constructor(private readonly backendApiClient: AxiosInstance) {
    if (!backendApiClient) {
      throw new Error("backendApiClient is required");
    }
  }

  async getAllPackages() {
    const {
      data: { data: packages, message },
      status,
    } = await this.backendApiClient.get<BackendResponse<Package[]>>(
      "/packages"
    );

    if (status !== StatusCodes.OK) throw new Error(message);

    return packages;
  }

  async getPackageById(packageId: Package["id"]): Promise<Package | null> {
    const {
      data: { data: packageInfo, message },
      status,
    } = await this.backendApiClient.get<BackendResponse<Package>>(
      `/packages/${packageId}`
    );

    if (status !== StatusCodes.OK) throw new Error(message);

    return packageInfo;
  }
}

export const packageService = new PackageService(backendClient);
