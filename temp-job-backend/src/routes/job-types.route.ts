import { Router } from "express";
import {
  getAllJobTypes,
  getJobTypeById,
  createNewJobType,
  updateJobTypeById,
  deleteJobTypeById,
} from "../controllers/job-types.controller";

const jobTypeRouter = Router();

jobTypeRouter.get("/", getAllJobTypes);
jobTypeRouter.get("/:jobTypeId", getJobTypeById);
jobTypeRouter.post("/", createNewJobType);
jobTypeRouter.patch("/:jobTypeId", updateJobTypeById);
jobTypeRouter.delete("/:jobTypeId", deleteJobTypeById);

export default jobTypeRouter;
