import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { themeService } from "../services/theme.service";
import { ThemeSchema } from "../models/theme.model";
import { getZodErrorMessage } from "../helpers/zod.helper";
import { freelancerService } from "../services/freelancer.service";

export async function createNewTheme(req: Request, res: Response) {
  try {
    // TODO : Validate request body
    const newTheme = await themeService.createNewTheme(req.body);

    if (!newTheme) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: "ล้มเหลวในการสร้างธีมใหม่",
      });
      return;
    }

    console.log(`[INFO] : สร้างธีมใหม่สำเร็จ -> ${newTheme.id}`);

    res.status(StatusCodes.CREATED).json({
      data: newTheme,
      message: "สร้างธีมใหม่สำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ล้มเหลวในการสร้างธีมใหม่ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ล้มเหลวในการสร้างธีมใหม่",
    });
  }
}

export async function deleteTheme(req: Request, res: Response) {
  try {
    const { themeId } = req.params;

    const deletedTheme = await themeService.deleteTheme(Number(themeId));

    try {
      await themeService.deleteAllThemeImagesByThemeId(Number(themeId));

      console.log(`[INFO] : ลบธีมสำเร็จ -> ${themeId}`);

      res.status(StatusCodes.OK).json({
        data: deletedTheme,
        message: "ลบธีมสำเร็จ",
      });
    } catch (error: any) {
      console.error(`[ERROR] : ล้มเหลวในการลบรูปภาพธีม -> ${error.message}`);

      // สร้างธีมใหม่อีกครั้งเมื่อลบรูปภาพไม่ได้
      await themeService.createNewTheme(deletedTheme);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: "ล้มเหลวในการลบรูปภาพธีม",
      });
    }
  } catch (error: any) {
    console.error(`[ERROR] : ล้มเหลวในการลบธีม -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ล้มเหลวในการลบธีม",
    });
  }
}

export async function getAllThemes(req: Request, res: Response) {
  try {
    const themes = await themeService.getAllThemes();

    console.log(`[INFO] : ดึงธีมทั้งหมดสำเร็จ -> ${themes.length}`);

    res.status(StatusCodes.OK).json({
      data: themes,
      message: "ดึงธีมทั้งหมดสำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ล้มเหลวในการดึงธีมทั้งหมด -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ล้มเหลวในการดึงธีมทั้งหมด",
    });
  }
}

export async function updateTheme(req: Request, res: Response) {
  try {
    const { themeId } = req.params;

    const { error } = ThemeSchema.omit({ id: true }).safeParse(req.body);

    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getZodErrorMessage(error),
      });
      return;
    }

    const updatedTheme = await themeService.updateThemeByThemeId(
      Number(themeId),
      req.body
    );

    console.log(`[INFO] : อัพเดตธีมสำเร็จ -> ${updatedTheme.id}`);

    res.status(StatusCodes.OK).json({
      data: updatedTheme,
      message: "อัพเดตธีมสำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ล้มเหลวในการอัพเดตธีม -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ล้มเหลวในการอัพเดตธีม",
    });
  }
}

export async function getPurchasedThemesByFreelancerId(
  req: Request,
  res: Response
) {
  try {
    const { freelancerId } = req.params;

    const { user } = res.locals;

    const freelancerInfo = await freelancerService.getFreelancerById(
      freelancerId
    );

    if (!freelancerInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ข้อมูลฟรีแลนเซอร์ไม่ถูกต้อง",
      });
      return;
    }

    if (freelancerInfo.user_id !== user.sub) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "คุณไม่มีสิทธิในการเข้าถึงข้อมูลฟรีแลนเซอร์นี้",
      });
      return;
    }

    const purchasedThemes = await themeService.getPurchasedThemesByFreelancerId(
      freelancerId
    );

    res.status(StatusCodes.OK).json({
      data: purchasedThemes,
      message: "ดึงธีมที่ซื้อสำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ล้มเหลวในการดึงธีมที่ซื้อ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ล้มเหลวในการดึงธีมที่ซื้อ",
    });
  }
}

export async function purchaseTheme(req: Request, res: Response) {
  try {
    const { themeId } = req.params;

    const { freelancerId } = req.query;

    const { user } = res.locals;

    console.log(
      `[INFO] : กำลังซื้อธีม (Query) -> freelancerId -> ${freelancerId}, themeId -> ${themeId}`
    );

    if (!freelancerId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: "กรุณาระบุรหัสฟรีแลนเซอร์",
      });
      return;
    }

    const freelancerInfo = await freelancerService.getFreelancerById(
      freelancerId as string
    );

    if (!freelancerInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ข้อมูลฟรีแลนเซอร์ไม่ถูกต้อง",
      });
      return;
    }

    const freelancerInfoByUserId =
      await freelancerService.getFreelancerProfileByUserId(user.sub);

    if (!freelancerInfoByUserId) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ข้อมูลฟรีแลนเซอร์ไม่ถูกต้อง",
      });
      return;
    }

    if (freelancerInfoByUserId.user_id !== freelancerInfo.user_id) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "คุณไม่มีสิทธิในการเข้าถึงข้อมูลฟรีแลนเซอร์นี้",
      });
      return;
    }

    const themeInfo = await themeService.getThemeById(parseInt(themeId));

    if (!themeInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ธีมไม่ถูกต้อง",
      });
      return;
    }

    if (freelancerInfo.coins < (themeInfo.price ?? 0)) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "จำนวน coins ไม่พอ",
      });
      return;
    }

    const purchasedThemes = await themeService.getPurchasedThemesByFreelancerId(
      freelancerId as string
    );

    if (purchasedThemes.find((pt) => pt.theme_id === parseInt(themeId))) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "ไม่สามารถซื้อธีมซ้ำได้",
      });
      return;
    }

    await freelancerService.updateFreelanceInfo(freelancerId as string, {
      coins: freelancerInfo.coins - (themeInfo.price ?? 0),
    });

    const purchasedTheme = await themeService.purchaseTheme(
      parseInt(themeId),
      freelancerId as string
    );

    console.log(`[INFO] : ซื้อธีมสำเร็จ -> ${purchasedTheme.id}`);

    res.status(StatusCodes.CREATED).json({
      data: purchasedTheme,
      message:
        (themeInfo?.price ?? 0) > 0 ? "ซื้อธีมสำเร็จ" : "รับธีมฟรีสำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ล้มเหลวในการซื้อธีม -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ล้มเหลวในการซื้อธีม",
    });
  }
}
