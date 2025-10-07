import { Router } from "express";
import {
  getBookmarkedJobsByUserId,
  toggleJobBookmark,
} from "../controllers/bookmarked-job.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const bookmarkedJobRouter = Router();

bookmarkedJobRouter.get(
  "/users/:userId",
  authMiddleware,
  getBookmarkedJobsByUserId
);
bookmarkedJobRouter.post("/toggle/:jobId", authMiddleware, toggleJobBookmark);

export default bookmarkedJobRouter;
