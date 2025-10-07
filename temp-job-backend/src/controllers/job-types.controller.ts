import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import jobTypeService from "../services/job-type.service";
import { JobTypeSchema } from "../models/posted-job.model";

export async function getAllJobTypes(req: Request, res: Response) {
  try {
    const jobTypes = await jobTypeService.getAllJobTypes();

    console.log(`[INFO] : ดึงข้อมูลประเภทงาน -> ${jobTypes.length} รายการ`);

    res
      .status(StatusCodes.OK)
      .json({ data: jobTypes, message: "ดึงข้อมูลประเภทงานได้สำเร็จ" });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลประเภทงานได้ -> ${error.message}`
    );
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถดึงข้อมูลประเภทงานได้" });
  }
}

export async function getJobTypeById(req: Request, res: Response) {
  try {
    const jobTypeId = req.params.jobTypeId;

    if (!jobTypeId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const jobType = await jobTypeService.getJobTypeById(Number(jobTypeId));

    console.log(`[INFO] : ดึงข้อมูลประเภทงาน -> ${jobType}`);
    res
      .status(StatusCodes.OK)
      .json({ data: jobType, message: "ดึงข้อมูลประเภทงานได้สำเร็จ" });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลประเภทงานได้ -> ${error.message}`
    );
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถดึงข้อมูลประเภทงานได้" });
  }
}

export async function createNewJobType(req: Request, res: Response) {
  try {
    const jobType = req.body;

    if (!jobType) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const { error: jobTypeError } = JobTypeSchema.omit({ id: true }).safeParse(
      jobType
    );

    if (jobTypeError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const newJobType = await jobTypeService.createNewJobType(jobType);

    console.log(`[INFO] : สร้างประเภทงาน -> ${newJobType}`);
    res
      .status(StatusCodes.CREATED)
      .json({ data: newJobType, message: "สร้างประเภทงานได้สำเร็จ" });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถสร้างประเภทงานได้ -> ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถสร้างประเภทงานได้" });
  }
}

export async function updateJobTypeById(req: Request, res: Response) {
  try {
    const jobTypeId = req.params.jobTypeId;

    if (!jobTypeId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const jobType = req.body;

    if (!jobType) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const { error: jobTypeError } = JobTypeSchema.omit({ id: true }).safeParse(
      jobType
    );

    if (jobTypeError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const updatedJobType = await jobTypeService.updateJobTypeById(
      Number(jobTypeId),
      jobType
    );

    console.log(`[INFO] : อัพเดตประเภทงาน -> ${updatedJobType}`);
    res
      .status(StatusCodes.OK)
      .json({ data: updatedJobType, message: "อัพเดตประเภทงานได้สำเร็จ" });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถอัพเดตประเภทงานได้ -> ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถอัพเดตประเภทงานได้" });
  }
}

export async function deleteJobTypeById(req: Request, res: Response) {
  try {
    const jobTypeId = req.params.jobTypeId;

    if (!jobTypeId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const deletedJobType = await jobTypeService.deleteJobTypeById(
      Number(jobTypeId)
    );

    console.log(`[INFO] : ลบประเภทงาน -> ${deletedJobType}`);
    res
      .status(StatusCodes.OK)
      .json({ data: deletedJobType, message: "ลบประเภทงานได้สำเร็จ" });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถลบประเภทงานได้ -> ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถลบประเภทงานได้" });
  }
}
