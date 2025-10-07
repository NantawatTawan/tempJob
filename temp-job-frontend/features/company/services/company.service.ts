import { StorageService } from "@/features/storage/services/storage.service";
import backendClient from "@/lib/axios";
import supabase from "@/lib/supabase";
import { BackendResponse } from "@/shared/types/api.type";
import { User } from "@supabase/supabase-js";
import { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import {
  Company,
  CompanyInfoForAdmin,
  CompanyType,
} from "../schemas/company.schema";
import { Package } from "@/features/packages/schemas/pacakge.schema";
import { Credentials } from "@/features/auth/schemas/auth.schema";

class CompanyService {
  constructor(
    private readonly backendClient: AxiosInstance,
    private readonly storageService: StorageService
  ) {
    if (!backendClient) {
      throw new Error("backendClient is required");
    }
    if (!storageService) {
      throw new Error("storageService is required");
    }
  }

  async createNewCompanyAccountByAdmin(
    companyInfo: Partial<Company>,
    credentials: Credentials
  ): Promise<Company | null> {
    const {
      data: { data: createdCompanyAccount, message },
      status,
    } = await this.backendClient.post<BackendResponse<Company>>(
      "/admin/company",
      {
        companyInfo,
        credentials,
      }
    );

    if (status !== StatusCodes.CREATED) {
      throw new Error(message);
    }

    return createdCompanyAccount;
  }

  async getAllCompanies(): Promise<Company[]> {
    const {
      data: { data: companies, message },
      status,
    } = await this.backendClient.get<BackendResponse<Company[]>>("/company");

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return companies ?? [];
  }

  async getAllCompaniesForAdmin(): Promise<CompanyInfoForAdmin[]> {
    const {
      data: { data: companies, message },
      status,
    } = await this.backendClient.get<BackendResponse<CompanyInfoForAdmin[]>>(
      "/admin/company-list"
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return companies ?? [];
  }

  async updateCompanyInfoByCompanyId(
    companyId: Company["id"],
    companyInfo: Partial<Omit<Company, "id" | "user_id">>
  ) {
    const {
      data: { data: updatedCompanyInfo, message },
      status,
    } = await this.backendClient.patch<BackendResponse<Company>>(
      `/company/${companyId}`,
      { newCompanyInfo: companyInfo }
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return updatedCompanyInfo;
  }

  async getCompanyByUserId(userId: User["id"]) {
    const {
      data: { data: company, message },
      status,
    } = await this.backendClient.get<BackendResponse<Company>>(
      `/company/detail/user/${userId}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return company;
  }

  async getCompanyLogoUrl(companyId: Company["id"]) {
    try {
      const images = await this.storageService.listAllFiles(companyId);
      const firstImage = images[0];
      return this.storageService.getFileUrl(`${companyId}/${firstImage}`);
    } catch (error) {
      throw new Error("ล้มเหลวในการดึงรูปภาพบริษัท");
    }
  }

  async updateCompanyLogo(
    companyId: Company["id"],
    logo: File,
    existingCompanyImageUrl: string
  ): Promise<string> {
    try {
      const existingFilesPaths =
        await this.storageService.listAllFilesWithPaths(companyId);

      if (existingFilesPaths.length) {
        await this.storageService.deleteFiles(existingFilesPaths);
      }

      const { path } = await this.storageService.uploadFile(
        logo,
        `${companyId}/${logo.name}`
      );
      return this.storageService.getFileUrl(path);
    } catch (error: any) {
      console.error(error.message);
      throw new Error("ล้มเหลวในการอัปโหลดรูปภาพบริษัท");
    }
  }

  async assignPackageToCompany(
    companyId: Company["id"],
    packageId: Package["id"]
  ) {
    const {
      data: { message },
      status,
    } = await this.backendClient.patch<BackendResponse<null>>(
      `/company/${companyId}/package/${packageId}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }
  }

  async getAllCompanyTypes(): Promise<CompanyType[]> {
    const {
      data: { data: companyTypes, message },
      status,
    } = await this.backendClient.get<BackendResponse<CompanyType[]>>(
      "/company/types"
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return companyTypes ?? [];
  }

  async deleteCompanyType(id: CompanyType["id"]) {
    const {
      data: { message },
      status,
    } = await this.backendClient.delete<BackendResponse<null>>(
      `/company/types/${id}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }
  }

  async createCompanyType(companyType: Omit<CompanyType, "id">) {
    const {
      data: { message },
      status,
    } = await this.backendClient.post<BackendResponse<CompanyType>>(
      "/company/types",
      { companyType }
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }
  }

  async updateCompanyType(id: CompanyType["id"], companyType: CompanyType) {
    const {
      data: { data: updatedCompanyType, message },
      status,
    } = await this.backendClient.patch<BackendResponse<CompanyType>>(
      `/company/types/${id}`,
      { newCompanyType: companyType }
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return updatedCompanyType;
  }
}

export const companyService = new CompanyService(
  backendClient,
  new StorageService("company-profile-image", supabase)
);
