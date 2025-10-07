import { Router } from "express";
import {
  getAllPackages,
  getPackageById,
} from "../controllers/package.controller";

const packageRouter = Router();

packageRouter.get("/", getAllPackages);
packageRouter.get("/:packageId", getPackageById);

export default packageRouter;
