import { Router } from "express";
import {
  createNewTheme,
  deleteTheme,
  getAllThemes,
  getPurchasedThemesByFreelancerId,
  purchaseTheme,
  updateTheme,
} from "../controllers/theme.controller";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware";

const themeRouter = Router();

themeRouter.get("/", getAllThemes);
themeRouter.post("/", authMiddleware, adminMiddleware, createNewTheme);

themeRouter.delete("/:themeId", authMiddleware, adminMiddleware, deleteTheme);
themeRouter.patch("/:themeId", authMiddleware, adminMiddleware, updateTheme);
themeRouter.post("/:themeId/purchase", authMiddleware, purchaseTheme);

themeRouter.get(
  "/purchase/freelancer/:freelancerId",
  authMiddleware,
  getPurchasedThemesByFreelancerId
);

export default themeRouter;
