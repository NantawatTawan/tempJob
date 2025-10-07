import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import userInfoService from "../services/user-info.service";
import companyService from "../services/company.service";
import { USER_ROLES } from "../models/user.model";
import { withCatch } from "../helpers/helper";
import { User } from "@supabase/supabase-js";
import subscriptionService from "../services/subscription.service";
import packageService from "../services/package.service";
export async function getCompanyList(req: Request, res: Response) {
  try {
    const companies = await companyService.getCompanyListForAdmin();

    console.log(
      `[INFO] : ดึงข้อมูลบริษัททั้งหมดได้สำหรับ admin สำเร็จ ->${companies.length} รายการ`
    );
    res.status(StatusCodes.OK).json({
      data: companies,
      message: getReasonPhrase(StatusCodes.OK),
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ดึงข้อมูลบริษัททั้งหมดได้สำหรับ admin ไม่สำเร็จ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}

export async function createNewCompanyByAdmin(req: Request, res: Response) {
  try {
    const { companyInfo, credentials } = req.body;

    if (!companyInfo || !credentials) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const [newUser, newUserError] = await withCatch<User | null>(async () =>
      userInfoService.createNewUserByAdmin(
        credentials.email,
        credentials.password
      )
    );

    if (newUserError) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: newUserError.message,
      });
    }

    if (!newUser) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบ user ที่ถูกสร้าง",
      });
      return;
    }

    const newUserInfo = await userInfoService.createNewUserInfo(
      newUser.id,
      USER_ROLES.USER
    );

    if (!newUserInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบ user info ที่ถูกสร้าง",
      });
    }

    const packageInfo = await packageService.getPackageById(
      companyInfo.package_id
    );

    if (!packageInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลกลุ่มบริษัท",
      });
      return;
    }

    const newSubscription = await subscriptionService.createNewSubscription(
      packageInfo
    );

    if (!newSubscription) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: "สร้าง subscription ไม่สำเร็จ",
      });
      return;
    }

    const newCompany = await companyService.createNewCompany({
      ...companyInfo,
      user_id: newUser.id,
      subscription_id: newSubscription.id,
    });

    console.log(`[INFO] : สร้างบริษัทใหม่เรียบร้อย -> ${newCompany.id}`);

    res.status(StatusCodes.CREATED).json({
      data: newCompany,
      message: "สร้างบริษัทใหม่เรียบร้อย",
    });
  } catch (error: any) {
    console.error(`[ERROR] : สร้างบริษัทใหม่ไม่สำเร็จ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ล้มเหลวระหว่างสร้างบริษัทใหม่",
    });
  }
}
