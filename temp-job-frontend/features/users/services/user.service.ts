import { BackendResponse } from "@/shared/types/api.type";
import { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { UserInfo } from "../schemas/user.schema";
import backendClient from "@/lib/axios";
export class UserService {
  constructor(private readonly backendClient: AxiosInstance) {
    if (!this.backendClient)
      throw new Error("backendClient is not initialized");
  }

  async getUserInfo(userId: string): Promise<UserInfo | null> {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.get<BackendResponse<UserInfo>>(
      `/user-info/${userId}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }
}

export const userService = new UserService(backendClient);
