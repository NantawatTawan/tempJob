import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bookmarkedJobService } from "../services/bookmarked-job.service";
import { STATUS_CODES } from "http";

export async function getBookmarkedJobsByUserId(req: Request, res: Response) {
  try {
    const userId = req.params.userId;

    const user = res.locals.user;

    if (user.sub !== userId) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "คุณไม่ได้รับสิทธิ์เข้าถึงข้อมูลนี้",
      });
      return;
    }

    const bookmarkedJobs = await bookmarkedJobService.getBookmarkedJobsByUserId(
      userId
    );

    console.log(
      `[INFO] : ดึงข้อมูลงานที่ถูกจัดเก็บได้สำเร็จ -> ${bookmarkedJobs.length}`
    );
    res.status(StatusCodes.OK).json({
      data: bookmarkedJobs,
      message: "ดึงข้อมูลงานที่ถูกจัดเก็บได้สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลงานที่ถูกจัดเก็บได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

export const toggleJobBookmark = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    const userId = res.locals.user.sub;

    const bookmarkedJob = await bookmarkedJobService.toggleJobBookmark(
      userId,
      jobId
    );

    res.status(StatusCodes.OK).json({
      data: bookmarkedJob,
      message: "เปลี่ยนสถานะการจัดเก็บงานเรียบร้อย",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถจัดเก็บงานได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "ไม่สามารถจัดเก็บงานได้",
    });
  }
};
