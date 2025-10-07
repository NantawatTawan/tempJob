import { NextFunction, Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import jwt from "jsonwebtoken";
import { env } from "../configs/env.config";
import { isUserAdmin } from "../helpers/user-info.helper";
import userInfoService from "../services/user-info.service";
import { freelancerService } from "../services/freelancer.service";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ data: null, message: "กรุณาเข้าสู่ระบบก่อนใช้งานระบบ" });
    return;
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ data: null, message: "กรุณาเข้าสู่ระบบก่อนใช้งานระบบ" });
    return;
  }

  const decoded = jwt.verify(token, env.SUPABASE_JWT_SECRET!);

  // [TIPS!] : For sub-sequent request, we can access the user info from res.locals.user
  res.locals.user = decoded;
  res.locals.hasUsedAuthMiddleware = true;

  next();
}

// [WARNING!] : Please use this middleware after authMiddleware
export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { hasUsedAuthMiddleware, user } = res.locals;

  if (!hasUsedAuthMiddleware) {
    console.error(
      `[ERROR] : กรูณาเรียกใช้ authMiddlware ก่อนใช้ adminMiddleware`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
    return;
  }

  if (!user) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ data: null, message: "คุณไม่มีสิทธิในการเข้าถึงข้อมูลนี้" });
    return;
  }

  const userInfo = await userInfoService.getUserInfoByUserId(user.sub);

  if (!isUserAdmin(userInfo)) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ data: null, message: "คุณไม่มีสิทธิในการเข้าถึงข้อมูลนี้" });
    return;
  }

  next();
}
