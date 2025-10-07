import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { freelancerService } from "../services/freelancer.service";
import {
  FreelancerSchema,
  ReviewFreelancerParamSchema,
} from "../models/freelancer.model";
import { getZodErrorMessage } from "../helpers/zod.helper";
import { postedJobService } from "../services/posted-job.service";
import { withCatch } from "../helpers/helper";
import companyService from "../services/company.service";

export async function createFreelancer(req: Request, res: Response) {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: "กรุณาส่งข้อมูล user_id ให้ครบ",
      });
      return;
    }

    const freelancer = await freelancerService.createFreelancer(userId);

    console.log(`[INFO] : สร้าง freelancer สำเร็จ -> ${freelancer.id}`);

    res.status(StatusCodes.CREATED).json({
      data: freelancer,
      message: "สร้าง freelancer สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถสร้าง freelancer ได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถสร้าง freelancer ได้",
    });
  }
}

export async function getFreelancers(req: Request, res: Response) {
  try {
    const freelancers = await freelancerService.getFreelancers();

    console.log(
      `[INFO] : ดึงข้อมูล freelancer สำเร็จ -> ${freelancers.length}`
    );

    res.status(StatusCodes.OK).json({
      data: freelancers,
      message: "ดึงข้อมูล freelancer สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูล freelancer ได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถดึงข้อมูล freelancer ได้",
    });
  }
}

export async function getFreelancerById(req: Request, res: Response) {
  try {
    const freelancerId = req.params.freelancerId;

    const freelancer = await freelancerService.getFreelancerById(freelancerId);

    if (!freelancer) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูล freelancer",
      });
      return;
    }

    console.log(`[INFO] : ดึงข้อมูล freelancer สำเร็จ -> ${freelancer.id}`);

    res.status(StatusCodes.OK).json({
      data: freelancer,
      message: "ดึงข้อมูล freelancer สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูล freelancer ได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถดึงข้อมูล freelancer ได้",
    });
  }
}

export async function getFreelancerProfileByUserId(
  req: Request,
  res: Response
) {
  try {
    const userId = req.params.userId;

    const freelancer = await freelancerService.getFreelancerProfileByUserId(
      userId
    );

    if (!freelancer) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูล freelancer",
      });
      return;
    }

    console.log(`[INFO] : ดึงข้อมูลฟรีแลนเซอร์สำเร็จ -> ${freelancer.id}`);

    res.status(StatusCodes.OK).json({
      data: freelancer,
      message: "ดึงข้อมูล freelancer สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูล freelancer ได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถดึงข้อมูล freelancer ได้",
    });
  }
}

export async function toggleFreelancerOpenForContactStatus(
  req: Request,
  res: Response
) {
  try {
    const freelancerId = req.params.freelancerId;

    const freelancer =
      await freelancerService.toggleFreelancerOpenForContactStatus(
        freelancerId
      );

    console.log(`[INFO] : ปิดเปิดสถานะฟรีแลนเซอร์สำเร็จ -> ${freelancer.id}`);

    res.status(StatusCodes.OK).json({
      data: freelancer,
      message: "ปิดเปิดสถานะฟรีแลนเซอร์สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถปิดเปิดสถานะฟรีแลนเซอร์ได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถปิดเปิดสถานะฟรีแลนเซอร์ได้",
    });
  }
}

export async function updateFreelancerInfo(req: Request, res: Response) {
  try {
    const freelancerId = req.params.freelancerId;

    const freelancerInfo = req.body;

    if (!freelancerInfo) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: "กรุณาส่งข้อมูลฟรีแลนเซอร์ให้ครบ",
      });
      return;
    }

    const parsedFreelancerInfo = FreelancerSchema.omit({
      id: true,
      user_id: true,
      created_at: true,
    })
      .partial()
      .safeParse(freelancerInfo);

    if (!parsedFreelancerInfo.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getZodErrorMessage(parsedFreelancerInfo.error),
      });
      return;
    }

    const updatedFreelancer = await freelancerService.updateFreelanceInfo(
      freelancerId,
      parsedFreelancerInfo.data
    );

    console.log(
      `[INFO] : อัพเดตข้อมูลฟรีแลนเซอร์สำเร็จ -> ${updatedFreelancer.id}`
    );

    res.status(StatusCodes.OK).json({
      data: updatedFreelancer,
      message: "อัพเดตข้อมูลฟรีแลนเซอร์สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถอัพเดตข้อมูลฟรีแลนเซอร์ได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถอัพเดตข้อมูลฟรีแลนเซอร์ได้",
    });
  }
}

export async function applyThemeForFreelancer(req: Request, res: Response) {
  try {
    const { freelancerId, themeId } = req.params;

    const { user } = res.locals;

    const freelancerInfo = await freelancerService.getFreelancerById(
      freelancerId
    );

    if (!freelancerInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลฟรีแลนเซอร์",
      });
      return;
    }

    if (freelancerInfo.user_id !== user.sub) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "คุณไม่มีสิทธิในการใช้ธีมแทนผู้ใช้ดังกล่าว",
      });
      return;
    }

    await freelancerService.applyThemeForFreelancer(
      freelancerId,
      parseInt(themeId)
    );

    res.status(StatusCodes.OK).json({
      data: null,
      message: "ใช้ธีมสำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถใช้ธีมได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถใช้ธีมได้",
    });
  }
}

export async function reviewFreelancer(req: Request, res: Response) {
  try {
    const { freelancerId } = req.params;

    const { rating, reviewContent, jobId } = req.query;

    const { user } = res.locals;

    const freelancerInfo = await freelancerService.getFreelancerById(
      freelancerId
    );

    if (!freelancerInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลฟรีแลนเซอร์",
      });
      return;
    }

    if (user.sub === freelancerInfo.user_id) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "คุณไม่สามารถรีวิวตัวเองได้",
      });
      return;
    }

    const jobInfo = await postedJobService.getPostedJobById(jobId as string);

    if (!jobInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลงาน",
      });
      return;
    }

    const hasAlreadyBeenReviewed =
      await freelancerService.hasAlreadyBeenReviewed(
        freelancerId,
        jobId as string
      );

    if (hasAlreadyBeenReviewed) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "คุณได้รีวิวคนนี้ไปแล้ว",
      });
      return;
    }

    const { data: reviewArguments, error: validationError } =
      ReviewFreelancerParamSchema.safeParse({
        freelancerId,
        jobId,
        rating: parseInt(rating as string),
        reviewContent,
      });

    if (validationError) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ data: null, message: getZodErrorMessage(validationError) });
      return;
    }

    await freelancerService.reviewFreelancer(reviewArguments);

    await companyService.incrementCompanyPoints(jobInfo.company_id);

    await freelancerService.addJobContact(freelancerId, jobId as string);

    console.log(
      `[INFO] : รีวิว freelancer สำเร็จ -> ${freelancerId} -> ${jobId}`
    );

    res.status(StatusCodes.CREATED).json({
      data: null,
      message: "รีวิวฟรีแลนเซอร์สำเร็จ",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถรีวิวฟรีแลนเซอร์ได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถรีวิวฟรีแลนเซอร์ได้",
    });
  }
}

export async function getFreelancerAppliedJobs(req: Request, res: Response) {
  try {
    const { freelancerId } = req.params;

    const appliedJobs = await freelancerService.getFreelancerAppliedJobs(
      freelancerId
    );

    res.status(StatusCodes.OK).json({
      data: appliedJobs,
      message: "ดึงงานที่ฟรีแลนเซอร์ได้รับจ้างสำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงงานที่ฟรีแลนเซอร์ได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถดึงงานที่ฟรีแลนเซอร์ได้",
    });
  }
}

export async function removeFreelancerInterestingJobType(
  req: Request,
  res: Response
) {
  try {
    const { freelancerId, jobTypeId } = req.params;

    const { user } = res.locals;

    const freelancerInfo = await freelancerService.getFreelancerById(
      freelancerId
    );

    if (!freelancerInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลฟรีแลนเซอร์",
      });
      return;
    }

    if (freelancerInfo.user_id !== user.sub) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "คุณไม่มีสิทธิในการลบงานที่สนใจ",
      });
      return;
    }

    await freelancerService.removeFreelancerInterestingJobType(
      freelancerId,
      parseInt(jobTypeId)
    );

    res.status(StatusCodes.OK).json({
      data: null,
      message: "ลบงานที่สนใจของ freelancer สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถลบงานที่สนใจของ freelancer ได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถลบงานที่สนใจของ freelancer ได้",
    });
  }
}

export async function addFreelancerInterestingJobType(
  req: Request,
  res: Response
) {
  try {
    const { freelancerId, jobTypeId } = req.params;

    const { user } = res.locals;

    const freelancerInfo = await freelancerService.getFreelancerById(
      freelancerId
    );

    if (!freelancerInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลฟรีแลนเซอร์",
      });
      return;
    }

    if (freelancerInfo.user_id !== user.sub) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "คุณไม่มีสิทธิในการเพิ่มงานที่สนใจ",
      });
      return;
    }

    const [, error] = await withCatch<void>(
      async () =>
        await freelancerService.addFreelancerInterestingJobType(
          freelancerId,
          parseInt(jobTypeId)
        )
    );

    if (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: error.message,
      });
      return;
    }

    res.status(StatusCodes.CREATED).json({
      data: null,
      message: "เพิ่มงานที่สนใจของ freelancer สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถเพิ่มงานที่สนใจของ freelancer ได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถเพิ่มงานที่สนใจของ freelancer ได้",
    });
  }
}
