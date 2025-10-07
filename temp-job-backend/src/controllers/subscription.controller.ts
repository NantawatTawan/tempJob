import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import companyService from "../services/company.service";
import subscriptionService from "../services/subscription.service";

export async function getSubscriptionById(req: Request, res: Response) {
  try {
    const { user } = res.locals;

    const { subscriptionId } = req.params;

    const companyInfo = await companyService.getCompanyInfoByUserId(user.sub);

    if (!companyInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลบริษัท",
      });
      return;
    }

    if (companyInfo.subscription_id !== parseInt(subscriptionId)) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "คุณไม่มีสิทธิในการเข้าถึงข้อมูลนี้",
      });
      return;
    }

    const subscription = await subscriptionService.getSubscriptionById(
      parseInt(subscriptionId)
    );

    if (!subscription) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูล subscription",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      data: subscription,
      message: "ดึงข้อมูลการสมัครสมาชิกได้สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลการสมัครสมาชิกได้ -> ${error.message}`
    );

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}
