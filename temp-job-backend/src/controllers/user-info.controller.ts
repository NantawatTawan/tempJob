import { Request, Response } from "express";
import { getReasonPhrase } from "http-status-codes";
import { StatusCodes } from "http-status-codes";
import userInfoService from "../services/user-info.service";

export async function getUserInfo(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const userInfo = await userInfoService.getUserInfoByUserId(userId);

    if (!userInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลผู้ใช้งาน",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      data: userInfo,
      message: "ดึงข้อมูลผู้ใช้งานเรียบร้อย",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลผู้ใช้งานได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}
