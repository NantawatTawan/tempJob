import { Request, Response } from "express";
import { educationMajorService } from "../services/education-major.service";
import { StatusCodes } from "http-status-codes";

export async function getAllEducationMajors(req: Request, res: Response) {
  try {
    const educationMajors = await educationMajorService.getAllEducationMajors();
    console.log(`[INFO] : ดึงข้อมูลสาขาการเรียนสำเร็จ`);
    res.status(StatusCodes.OK).json({
      data: educationMajors,
      message: "ดึงข้อมูลสาขาการเรียนสำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ล้มเหลวในการดึงข้อมูลสาขาการเรียน -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error.message,
    });
  }
}

export async function getEducationMajorById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const educationMajor = await educationMajorService.getEducationMajorById(
      id
    );
    console.log(`[INFO] : ดึงข้อมูลสาขาการเรียน -> ID: ${id} สำเร็จ`);
    res.status(StatusCodes.OK).json({
      data: educationMajor,
      message: "ดึงข้อมูลสาขาการเรียนสำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ล้มเหลวในการดึงข้อมูลสาขาการเรียน -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error.message,
    });
  }
}

export async function createEducationMajor(req: Request, res: Response) {
  try {
    const educationMajorData = req.body;

    const createdEducationMajor =
      await educationMajorService.createEducationMajor(educationMajorData);

    console.log(`[INFO] : สร้างสาขาการเรียนสำเร็จ`);
    res.status(StatusCodes.CREATED).json({
      data: createdEducationMajor,
      message: "สร้างสาขาการเรียนสำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถสร้างสาขาการเรียนได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error.message,
    });
  }
}

export async function updateEducationMajor(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const educationMajorData = req.body;

    const updatedEducationMajor =
      await educationMajorService.updateEducationMajor(
        Number(id),
        educationMajorData
      );

    console.log(`[INFO] : อัปเดตสาขาการเรียน -> ID: ${id} สำเร็จ`);
    res.status(StatusCodes.OK).json({
      data: updatedEducationMajor,
      message: "อัปเดตสาขาการเรียนสำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถอัปเดตสาขาการเรียนได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error.message,
    });
  }
}

export async function deleteEducationMajor(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const deletedEducationMajor =
      await educationMajorService.deleteEducationMajor(Number(id));

    console.log(`[INFO] : ลบสาขาการเรียน -> ID: ${id} สำเร็จ`);
    res.status(StatusCodes.OK).json({
      data: deletedEducationMajor,
      message: "ลบสาขาการเรียนสำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถลบสาขาการเรียนได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error.message,
    });
  }
}
