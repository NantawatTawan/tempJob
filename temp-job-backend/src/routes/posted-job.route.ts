import { Router } from "express";
import {
  activateJob,
  deleteJob,
  disableJob,
  getAllPostedJobs,
  getPostedJobsByCompanyId,
  getPostedJobsWithApplicantsAndViews,
  getPostedJobsWithApplicantsAndViewsByJobId,
  incrementJobView,
  postJob,
  refreshAllJobsDateByCompanyId,
  applyJobForFreelancer,
  deleteJobApplicationForFreelancer,
  hireFreelancer,
} from "../controllers/posted-job.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const postedJobRoute = Router();

postedJobRoute.get("/", authMiddleware, getPostedJobsWithApplicantsAndViews);
postedJobRoute.get("/all", authMiddleware, getAllPostedJobs);
postedJobRoute.post("/", authMiddleware, postJob);
postedJobRoute.get(
  "/detail/:jobId",
  getPostedJobsWithApplicantsAndViewsByJobId
);
postedJobRoute.get(
  "/company/:companyId",
  authMiddleware,
  getPostedJobsByCompanyId
);
postedJobRoute.post("/detail/:jobId/view", authMiddleware, incrementJobView);
postedJobRoute.patch("/detail/:jobId/disable", authMiddleware, disableJob);
postedJobRoute.patch("/detail/:jobId/activate", authMiddleware, activateJob);
postedJobRoute.post(
  "/refresh-date",
  authMiddleware,
  refreshAllJobsDateByCompanyId
);

postedJobRoute.post(
  "/:jobId/application/freelancer/:freelancerId",
  authMiddleware,
  applyJobForFreelancer
);
postedJobRoute.delete(
  "/:jobId/application/freelancer/:freelancerId",
  authMiddleware,
  deleteJobApplicationForFreelancer
);
postedJobRoute.delete("/:jobId", authMiddleware, deleteJob);

postedJobRoute.post(
  "/:jobId/hire/freelancer/:freelancerId",
  authMiddleware,
  hireFreelancer
);

export default postedJobRoute;
