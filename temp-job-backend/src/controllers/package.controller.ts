import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { Response, Request } from "express";
import packageService from "../services/package.service";

export async function getAllPackages(req: Request, res: Response) {
  try {
    const packages = await packageService.getAllPackages();

    res.status(StatusCodes.OK).json({
      data: packages,
      message: getReasonPhrase(StatusCodes.OK),
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลแพ็คเก็จได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}

export async function getPackageById(req: Request, res: Response) {
  try {
    const { packageId } = req.params;

    const packageInfo = await packageService.getPackageById(Number(packageId));

    res.status(StatusCodes.OK).json({
      data: packageInfo,
      message: getReasonPhrase(StatusCodes.OK),
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลแพ็คเก็จได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}
