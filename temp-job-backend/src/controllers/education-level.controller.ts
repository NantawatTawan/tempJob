import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { Response, Request } from "express";
import { educationLevelService } from "../services/education-level.service";

export async function getAllEducationLevels(req: Request, res: Response) {
  try {
    const educationLevels = await educationLevelService.getAllEducationLevels();

    console.log(
      `[INFO] : ดึงข้อมูลระดับการศึกษาสำเร็จ -> ${educationLevels.length}`
    );
    res.status(StatusCodes.OK).json({
      data: educationLevels,
      message: "ดึงข้อมูลระดับการศึกษาสำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลระดับการศึกษาได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

export async function getEducationLevelById(req: Request, res: Response) {
  try {
    const educationLevelId = req.params.educationLevelId;

    if (!educationLevelId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const educationLevel = await educationLevelService.getEducationLevelById(
      Number(educationLevelId)
    );

    console.log(
      `[INFO] : ดึงข้อมูลระดับการศึกษา -> ${educationLevel}`
    );
    res.status(StatusCodes.OK).json({
      data: educationLevel,
      message: "ดึงข้อมูลระดับการศึกษาได้สำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถดึงข้อมูลระดับการศึกษาได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error.message,
    });
  }
}
