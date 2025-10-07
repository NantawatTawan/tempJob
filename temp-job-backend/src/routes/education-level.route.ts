import { Router } from "express";
import {
  getAllEducationLevels,
  getEducationLevelById,
} from "../controllers/education-level.controller";

const educationLevelRouter = Router();

educationLevelRouter.get("/", getAllEducationLevels);
educationLevelRouter.get("/:educationLevelId", getEducationLevelById);

export default educationLevelRouter;
