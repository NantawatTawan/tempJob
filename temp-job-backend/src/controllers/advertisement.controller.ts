import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import advertisementService from "../services/advertisement.service";

export async function getAllAdvertisements(req: Request, res: Response) {
  try {
    const advertisements = await advertisementService.getAllAdvertisements();

    console.log(`[INFO] : ดึงข้อมูลโฆษณา -> ${advertisements.length} รายการ`);

    res.status(StatusCodes.OK).json({
      data: advertisements,
      message: "ดึงข้อมูลโฆษณาได้สำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถดึงข้อมูลโฆษณาได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error.message,
    });
  }
}

export async function deleteAdvertisementById(req: Request, res: Response) {
  try {
    const advertisementId = req.params.id;

    const deletedAdvertisement =
      await advertisementService.deleteAdvertisementById(
        Number(advertisementId)
      );

    console.log(`[INFO] : ลบโฆษณา -> ID: ${advertisementId} สำเร็จ`);
    res.status(StatusCodes.OK).json({
      data: deletedAdvertisement,
      message: "ลบโฆษณาสำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถลบโฆษณาได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error.message,
    });
  }
}

export async function getAdvertisementById(req: Request, res: Response) {
  try {
    const advertisementId = req.params.id;

    if (!advertisementId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: "กรุณาระบุ ID ของโฆษณา",
      });
      return;
    }

    const advertisement = await advertisementService.getAdvertisementById(
      Number(advertisementId)
    );

    if (!advertisement) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบโฆษณา",
      });
      return;
    }

    console.log(`[INFO] : ดึงข้อมูลโฆษณา -> ID: ${advertisementId} สำเร็จ`);
    res.status(StatusCodes.OK).json({
      data: advertisement,
      message: "ดึงข้อมูลโฆษณาสำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถดึงข้อมูลโฆษณาได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error.message,
    });
  }
}

export async function updateAdvertisementById(req: Request, res: Response) {
  try {
    const advertisementId = req.params.id;
    const advertisementData = req.body;

    const updatedAdvertisement =
      await advertisementService.updateAdvertisementById(
        Number(advertisementId),
        advertisementData
      );

    console.log(`[INFO] : อัปเดตโฆษณา -> ID: ${advertisementId} สำเร็จ`);
    res.status(StatusCodes.OK).json({
      data: updatedAdvertisement,
      message: "อัปเดตโฆษณาสำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถอัปเดตโฆษณาได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error.message,
    });
  }
}

export async function createAdvertisement(req: Request, res: Response) {
  try {
    const advertisementData = req.body;

    const createdAdvertisement =
      await advertisementService.createNewAdvertisement(advertisementData);

    console.log(`[INFO] : สร้างโฆษณา -> ${createdAdvertisement}`);

    res.status(StatusCodes.CREATED).json({
      data: createdAdvertisement,
      message: "สร้างโฆษณาสำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถสร้างโฆษณาได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error.message,
    });
  }
}
