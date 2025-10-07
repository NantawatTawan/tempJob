import { Router } from "express";
import {
  getAllCompanies,
  getCompanyDetailByUserId,
  updateCompanyInfoByCompanyId,
  assignPackageToCompany,
  getAllCompanyTypes,
  createNewCompanyType,
  updateCompanyTypeById,
  deleteCompanyTypeById,
} from "../controllers/company.controller";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware";

const companyRouter = Router();

companyRouter.get("/", authMiddleware, getAllCompanies);
companyRouter.get("/types", getAllCompanyTypes);
companyRouter.post("/types", createNewCompanyType);
companyRouter.patch("/types/:companyTypeId", updateCompanyTypeById);
companyRouter.delete("/types/:companyTypeId", deleteCompanyTypeById);
companyRouter.get(
  "/detail/user/:userId",
  authMiddleware,
  getCompanyDetailByUserId
);

companyRouter.patch(
  "/:companyId",
  authMiddleware,
  updateCompanyInfoByCompanyId
);

companyRouter.patch(
  "/:companyId/package/:packageId",
  authMiddleware,
  adminMiddleware,
  assignPackageToCompany
);

export default companyRouter;
