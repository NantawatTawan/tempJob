import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getUserInfo } from "../controllers/user-info.controller";

const userInfoRouter = Router();

userInfoRouter.get("/:userId", authMiddleware, getUserInfo);

export default userInfoRouter;
