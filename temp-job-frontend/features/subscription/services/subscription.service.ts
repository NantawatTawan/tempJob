import backendClient from "@/lib/axios";
import { BackendResponse } from "@/shared/types/api.type";
import { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { Subscription } from "../schemas/subscription.schema";

export class SubscriptionService {
  constructor(private readonly _backendClient: AxiosInstance) {
    if (!backendClient) {
      throw new Error("backendClient is required");
    }
  }

  async getSubscriptionById(
    subscriptionId: number
  ): Promise<Subscription | null> {
    const {
      data: { data, message },
      status,
    } = await this._backendClient.get<BackendResponse<Subscription>>(
      `/subscriptions/${subscriptionId}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }
}
export const subscriptionService = new SubscriptionService(backendClient);
