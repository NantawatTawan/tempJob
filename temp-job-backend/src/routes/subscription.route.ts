import { Router } from "express";
import { getSubscriptionById } from "../controllers/subscription.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const subscriptionRouter = Router();

subscriptionRouter.get("/:subscriptionId", authMiddleware, getSubscriptionById);

export default subscriptionRouter;
