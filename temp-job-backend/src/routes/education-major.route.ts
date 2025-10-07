import { Router } from "express";
import {
  getAllEducationMajors,
  getEducationMajorById,
  createEducationMajor,
  updateEducationMajor,
  deleteEducationMajor,
} from "../controllers/education-major.controller";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware";

const educationMajorRouter = Router();

educationMajorRouter.get("/", getAllEducationMajors);
educationMajorRouter.get("/:id", getEducationMajorById);
educationMajorRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createEducationMajor
);
educationMajorRouter.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateEducationMajor
);
educationMajorRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteEducationMajor
);

export default educationMajorRouter;
