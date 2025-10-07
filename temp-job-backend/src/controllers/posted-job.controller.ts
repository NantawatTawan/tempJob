import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { doesCompanyHaveSubscription } from "../helpers/company.helper";
import {
  hasFreelancerMetTheMinimumEducationLevel,
  hasJobExpired,
} from "../helpers/posted-job.helper";
import { hasSubscriptionExpired } from "../helpers/subscription.helper";
import companyService from "../services/company.service";
import { freelancerService } from "../services/freelancer.service";
import packageService from "../services/package.service";
import { postedJobService } from "../services/posted-job.service";
import subscriptionService from "../services/subscription.service";

export async function getPostedJobsWithApplicantsAndViewsByJobId(
  req: Request,
  res: Response
) {
  try {
    const jobId = req.params.jobId;

    if (!jobId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const postedJob =
      await postedJobService.getPostedJobsWithApplicantsAndViewsByJobId(jobId);

    console.log(`[INFO] : ดึงข้อมูลงานที่โพสได้สำเร็จ`);
    res
      .status(StatusCodes.OK)
      .json({ data: postedJob, message: "ดึงข้อมูลงานที่โพสได้สำเร็จ" });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลงานที่โพสได้ -> ${error.message}`
    );
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถดึงข้อมูลงานที่โพสได้" });
  }
}

export async function incrementJobView(req: Request, res: Response) {
  try {
    const user = res.locals.user;

    const jobId = req.params.jobId;

    if (!jobId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    await postedJobService.incrementJobView(jobId, user.sub);

    console.log(`[INFO] : เพิ่มคนดูงานได้สำเร็จ`);
    res
      .status(StatusCodes.OK)
      .json({ data: null, message: "เพิ่มคนดูงานได้สำเร็จ" });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถเพิ่มคนดูงานได้ -> ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถเพิ่มคนดูงานได้" });
  }
}

export async function getPostedJobsWithApplicantsAndViews(
  req: Request,
  res: Response
) {
  try {
    const user = res.locals.user;

    const companyInfo = await companyService.getCompanyInfoByUserId(user.sub);

    if (!companyInfo) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ data: null, message: "ไม่พบข้อมูลบริษัท" });
      return;
    }

    const postedJobs =
      await postedJobService.getPostedJobsWithApplicantsAndViews(
        companyInfo.id
      );

    console.log(
      `[INFO] : ดึงข้อมูลงานที่โพสได้ -> ${postedJobs.length} รายการ`
    );
    res
      .status(StatusCodes.OK)
      .json({ data: postedJobs, message: "ดึงข้อมูลงานที่โพสได้สำเร็จ" });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลงานที่โพสได้ -> ${error.message}`
    );
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถดึงข้อมูลงานที่โพสได้" });
  }
}

export async function postJob(req: Request, res: Response) {
  try {
    const user = res.locals.user;

    const companyInfo = await companyService.getCompanyInfoByUserId(user.sub);

    if (!companyInfo) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ data: null, message: "ไม่พบข้อมูลบริษัท" });
      return;
    }

    const job = req.body.job;

    if (!job) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ data: null, message: "ไม่พบข้อมูลงานใน parameter" });
      return;
    }

    if (!doesCompanyHaveSubscription(companyInfo)) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "บริษัทของคุณไม่มีการ subscription",
      });

      return;
    }

    const companySubscription = await subscriptionService.getSubscriptionById(
      Number(companyInfo.subscription_id)
    );

    if (!companySubscription) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "ไม่พบข้อมูลการ subscription ของบริษัท",
      });
      return;
    }

    if (hasSubscriptionExpired(companySubscription)) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message:
          "การ subscription ของบริษัทของคุณหมดอายุ กรุณาติดต่อทีมงานเพื่อทำการต่ออายุ",
      });
      return;
    }

    const companyPackageInfo = await packageService.getPackageById(
      Number(companyInfo.package_id)
    );

    if (!companyPackageInfo) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "ไม่พบข้อมูลการ package ของบริษัท",
      });
      return;
    }

    const currentCompanyPostedJobs =
      await postedJobService.getPostedJobsByCompanyId(companyInfo.id);

    if (currentCompanyPostedJobs.length >= companyPackageInfo.jobs_limit) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "คุณได้โพสงานเกินกำหนดในการ package ของคุณแล้ว",
      });
      return;
    }

    const postedJob = await postedJobService.postJob({
      ...job,
      company_id: companyInfo.id,
      expired_at: companySubscription.expired_at,
    });

    console.log(`[INFO] : โพสงานสำเร็จ -> ${postedJob}`);

    res
      .status(StatusCodes.CREATED)
      .json({ data: postedJob, message: "โพสงานสำเร็จ" });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถโพสงานได้ -> ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถโพสงานได้" });
  }
}

export async function deleteJob(req: Request, res: Response) {
  try {
    const user = res.locals.user;

    const jobId = req.params.jobId;

    if (!jobId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const companyInfo = await companyService.getCompanyInfoByUserId(user.sub);

    if (!companyInfo) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ data: null, message: "ไม่พบข้อมูลบริษัทของ user" });
      return;
    }

    const jobInfo = await postedJobService.getPostedJobById(jobId);

    if (!jobInfo) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ data: null, message: "ไม่พบข้อมูลงาน" });
      return;
    }

    if (jobInfo.company_id !== companyInfo.id) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ data: null, message: "ไม่มีสิทธิในการลบงานนี้" });
      return;
    }

    const deletedJob = await postedJobService.deleteJob(jobId);

    console.log(`[INFO] : ลบงานสำเร็จ -> ${deletedJob}`);
    res
      .status(StatusCodes.OK)
      .json({ data: deletedJob, message: "ลบงานสำเร็จ" });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถลบงานได้ -> ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถลบงานได้" });
  }
}

export async function disableJob(req: Request, res: Response) {
  try {
    const user = res.locals.user;

    const jobId = req.params.jobId;

    const companyInfo = await companyService.getCompanyInfoByUserId(user.sub);

    if (!companyInfo) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ data: null, message: "ไม่พบข้อมูลบริษัทของ user" });
      return;
    }

    if (!jobId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const jobInfo = await postedJobService.getPostedJobById(jobId);

    if (!jobInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: getReasonPhrase(StatusCodes.NOT_FOUND),
      });
      return;
    }

    if (jobInfo.company_id !== companyInfo.id) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: getReasonPhrase(StatusCodes.FORBIDDEN),
      });
      return;
    }

    const disabledJob = await postedJobService.disableJob(jobId);

    console.log(`[INFO] : ปิดงานสำเร็จ -> ${disabledJob}`);
    res
      .status(StatusCodes.OK)
      .json({ data: disabledJob, message: "ปิดงานสำเร็จ" });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถปิดงานได้ -> ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถปิดงานได้" });
  }
}

export async function refreshAllJobsDateByCompanyId(
  req: Request,
  res: Response
) {
  try {
    const user = res.locals.user;

    const companyInfo = await companyService.getCompanyInfoByUserId(user.sub);

    if (!companyInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: getReasonPhrase(StatusCodes.NOT_FOUND),
      });
      return;
    }

    const refreshedJobs = await postedJobService.refreshAllJobsDateByCompanyId(
      companyInfo.id
    );

    console.log(`[INFO] : ลบงานสำเร็จ -> ${refreshedJobs}`);
    res
      .status(StatusCodes.OK)
      .json({ data: refreshedJobs, message: "ลบงานสำเร็จ" });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถลบงานได้ -> ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถลบงานได้" });
  }
}

export async function getPostedJobsByCompanyId(req: Request, res: Response) {
  try {
    const { companyId } = req.params;

    const postedJobs = await postedJobService.getPostedJobsByCompanyId(
      companyId
    );

    console.log(`[INFO] : ดึงข้อมูลงานที่โพสได้สำเร็จ -> ${postedJobs.length}`);

    res.status(StatusCodes.OK).json({
      data: postedJobs,
      message: "ดึงข้อมูลงานที่โพสได้สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลงานที่โพสได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถดึงข้อมูลงานที่โพสได้",
    });
  }
}

export async function activateJob(req: Request, res: Response) {
  try {
    const user = res.locals.user;

    const jobId = req.params.jobId;

    const companyInfo = await companyService.getCompanyInfoByUserId(user.sub);

    if (!companyInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: getReasonPhrase(StatusCodes.NOT_FOUND),
      });
      return;
    }

    if (!jobId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    const jobInfo = await postedJobService.getPostedJobById(jobId);

    if (!jobInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: getReasonPhrase(StatusCodes.NOT_FOUND),
      });
      return;
    }

    if (jobInfo.company_id !== companyInfo.id) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "ไม่มีสิทธิในการเปิดงานนี้",
      });
      return;
    }

    const activatedJob = await postedJobService.activateJob(jobId);

    console.log(`[INFO] : เปิดงานสำเร็จ -> ${activatedJob}`);
    res
      .status(StatusCodes.OK)
      .json({ data: activatedJob, message: "เปิดงานสำเร็จ" });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถเปิดงานได้ -> ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ data: null, message: "ไม่สามารถเปิดงานได้" });
  }
}

export async function getAllPostedJobs(req: Request, res: Response) {
  try {
    const postedJobs = await postedJobService.getAllPostedJobs();

    console.log(`[INFO] : ดึงข้อมูลงานที่โพสได้สำเร็จ -> ${postedJobs.length}`);

    res.status(StatusCodes.OK).json({
      data: postedJobs,
      message: "ดึงข้อมูลงานที่โพสได้สำเร็จ",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลงานที่โพสได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถดึงข้อมูลงานที่โพสได้",
    });
  }
}

export async function applyJobForFreelancer(req: Request, res: Response) {
  try {
    const { jobId, freelancerId } = req.params;

    const jobInfo = await postedJobService.getPostedJobById(jobId);

    if (!jobInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลงาน",
      });
      return;
    }

    if (hasJobExpired(jobInfo)) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "งานนี้หมดอายุแล้ว",
      });
      return;
    }

    const freelancerInfo = await freelancerService.getFreelancerById(
      freelancerId
    );

    if (!freelancerInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลผู้สมัคร",
      });
      return;
    }

    if (
      !hasFreelancerMetTheMinimumEducationLevel(
        jobInfo.education_level,
        freelancerInfo.education_level
      )
    ) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "วุฒิการศึกษาของคุณไม่ตรงกับงานนี้",
      });
      return;
    }

    const appliedJob = await postedJobService.applyJobForFreelancer(
      jobId,
      freelancerId
    );

    console.log(`[INFO] : งานถูกลงทะเบียนเรียบร้อย -> ${appliedJob}`);

    res.status(StatusCodes.OK).json({
      data: appliedJob,
      message: "งานถูกลงทะเบียนเรียบร้อย",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถลงทะเบียนเรียบร้อย -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถลงทะเบียนได้",
    });
  }
}

export async function deleteJobApplicationForFreelancer(
  req: Request,
  res: Response
) {
  try {
    const { jobId, freelancerId } = req.params;

    const deletedJobApplication =
      await postedJobService.deleteJobApplicationForFreelancer(
        jobId,
        freelancerId
      );

    console.log(
      `[INFO] : ลบงานถูกลงทะเบียนเรียบร้อย -> ${deletedJobApplication}`
    );

    res.status(StatusCodes.OK).json({
      data: deletedJobApplication,
      message: "ลบงานถูกลงทะเบียนเรียบร้อย",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถลบงานถูกลงทะเบียนเรียบร้อย -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถลบงานถูกลงทะเบียนได้",
    });
  }
}

export async function hireFreelancer(req: Request, res: Response) {
  try {
    const { jobId, freelancerId } = req.params;

    const { user } = res.locals;

    const hasFreelancerAppliedForJob =
      await postedJobService.hasFreelancerAppliedForJob(jobId, freelancerId);

    if (hasFreelancerAppliedForJob) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "ฟรีแลนเซอร์ได้สมัครงานนี้แล้ว",
      });
      return;
    }

    const companyInfo = await companyService.getCompanyInfoByUserId(user.sub);

    if (!companyInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลบริษัทของ user",
      });
      return;
    }

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

    const jobInfo = await postedJobService.getPostedJobById(jobId);

    if (!jobInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลงาน",
      });
      return;
    }

    if (jobInfo.company_id !== companyInfo.id) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "ไม่มีสิทธิในการจ้างฟรีแลนเซอร์",
      });
      return;
    }

    await postedJobService.hireFreelancer(jobId, freelancerId);

    console.log(`[INFO] : จ้างฟรีแลนสำหรับงาน ${jobInfo.id} เรียบร้อย`);

    res.status(StatusCodes.CREATED).json({
      data: null,
      message: "งานถูกจ้างฟรีแลนเซอร์เรียบร้อย",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถจ้างฟรีแลนเซอร์ได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: "ไม่สามารถจ้างฟรีแลนเซอร์ได้",
    });
  }
}
