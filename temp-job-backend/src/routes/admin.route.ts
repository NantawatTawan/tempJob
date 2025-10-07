import { Router } from "express";
import {
  createNewCompanyByAdmin,
  getCompanyList,
} from "../controllers/admin.controller";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware";

const adminRouter = Router();

adminRouter.get(
  "/company-list",
  authMiddleware,
  adminMiddleware,
  getCompanyList
);

// SUB ROUTE : /company
adminRouter.post(
  "/company",
  authMiddleware,
  adminMiddleware,
  createNewCompanyByAdmin
);

export default adminRouter;
