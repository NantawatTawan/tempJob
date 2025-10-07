import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/omise/source", PaymentController.createOmiseSource);
paymentRouter.post("/omise/charge", PaymentController.createOmiseCharge);
paymentRouter.post("/omise/webhook", PaymentController.handleOmiseWebhookEvent);

export default paymentRouter;
