import { Router } from "express";
import {
  getFreelancerProfileByUserId,
  toggleFreelancerOpenForContactStatus,
  updateFreelancerInfo,
  applyThemeForFreelancer,
  getFreelancers,
  getFreelancerById,
  reviewFreelancer,
  createFreelancer,
  getFreelancerAppliedJobs,
  removeFreelancerInterestingJobType,
  addFreelancerInterestingJobType,
} from "../controllers/freelancer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const freelancerRouter = Router();

freelancerRouter.get("/", getFreelancers);
freelancerRouter.post("/", createFreelancer);
freelancerRouter.get("/:freelancerId", getFreelancerById);
freelancerRouter.get("/users/:userId/profile", getFreelancerProfileByUserId);
freelancerRouter.patch(
  "/:freelancerId/open-for-contact/toggle",
  authMiddleware,
  toggleFreelancerOpenForContactStatus
);
freelancerRouter.patch(
  "/:freelancerId/info",
  authMiddleware,
  updateFreelancerInfo
);
freelancerRouter.post(
  "/:freelancerId/interesting-job-type/:jobTypeId",
  authMiddleware,
  addFreelancerInterestingJobType
);
freelancerRouter.delete(
  "/:freelancerId/interesting-job-type/:jobTypeId",
  authMiddleware,
  removeFreelancerInterestingJobType
);
freelancerRouter.post(
  "/:freelancerId/review",
  authMiddleware,
  reviewFreelancer
);
freelancerRouter.get(
  "/:freelancerId/applied-jobs",
  authMiddleware,
  getFreelancerAppliedJobs
);
freelancerRouter.patch(
  "/:freelancerId/theme/:themeId",
  authMiddleware,
  applyThemeForFreelancer
);

export default freelancerRouter;
