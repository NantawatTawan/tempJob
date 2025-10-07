import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Omise } from "../configs/omise.config";
import {
  isChargeResponseErrorBadRequest,
  isSourceReponseASourceInfo,
  isSourceResponseErrorBadRequest,
  validateChargeResponse,
  validateSourceResponse,
} from "../helpers/omise.helper";
import { PAYMENT_ACTIONS } from "../models/enums/payment-action.enum";
import { freelancerService } from "../services/freelancer.service";

const SATANG = 100;
const MINIMUM_OMISE_AMOUNT = 20 * SATANG;

export class PaymentController {
  static async createOmiseSource(req: Request, res: Response) {
    try {
      const { amount, paymentType } = req.body;

      if (amount <= MINIMUM_OMISE_AMOUNT) {
        res.status(StatusCodes.BAD_REQUEST).json({
          data: null,
          message: `จำนวนเงินต้องมีค่ามากกว่า ${
            MINIMUM_OMISE_AMOUNT / SATANG
          } บาท`,
        });
        return;
      }

      if (amount === undefined || paymentType === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({
          data: null,
          message: "กรุณาระบุจำนวนเงินและประเภทการชำระเงิน",
        });
        return;
      }

      const source = await Omise.source.create({
        amount,
        currency: "thb",
        type: paymentType,
      });

      const { isError, message } = validateSourceResponse(source);

      if (isError) {
        if (isSourceResponseErrorBadRequest(source)) {
          res.status(StatusCodes.BAD_REQUEST).json({
            data: null,
            message,
          });
          return;
        }
        throw new Error(message);
      }

      console.log(`[INFO] : สร้าง payment source สำหรับ omise สำเร็จ`);

      res.status(StatusCodes.CREATED).json({
        data: source,
        message: "สร้าง payment source สำหรับ omise สำเร็จ",
      });
    } catch (error: any) {
      console.error(
        `[ERROR] : ล้มเหลวระหว่างการสร้าง payment source สำหรับ omise -> ${error.message}`
      );
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: "ล้มเหลวระหว่างการสร้าง payment source สำหรับ omise",
      });
    }
  }

  static async createOmiseCharge(req: Request, res: Response) {
    try {
      const { sourceId, metadata } = req.body;

      if (!sourceId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          data: null,
          message: "กรุณาระบุ sourceId",
        });
        return;
      }

      const sourceInfo = await Omise.source.retrieve(sourceId);

      const { isError: isSourceError, message: sourceErrorMessage } =
        validateSourceResponse(sourceInfo);

      if (isSourceError) {
        if (isSourceResponseErrorBadRequest(sourceInfo)) {
          res.status(StatusCodes.BAD_REQUEST).json({
            data: null,
            message: sourceErrorMessage,
          });
          return;
        }

        throw new Error(sourceErrorMessage);
      }

      if (!isSourceReponseASourceInfo(sourceInfo)) {
        throw new Error("sourceInfo ไม่ใช่ข้อมูลของ source");
      }

      const charge = await Omise.charge.create({
        amount: sourceInfo.amount,
        currency: "thb",
        source: sourceId,
        metadata,
      });

      const { isError: isChargeError, message: chargeErrorMessage } =
        validateChargeResponse(charge);

      if (isChargeError) {
        if (isChargeResponseErrorBadRequest(charge)) {
          res.status(StatusCodes.BAD_REQUEST).json({
            data: null,
            message: chargeErrorMessage,
          });
          return;
        }

        throw new Error(chargeErrorMessage);
      }

      res.status(StatusCodes.CREATED).json({
        data: charge,
        message: "สร้าง payment charge สำหรับ omise สำเร็จ",
      });
    } catch (error: any) {
      console.error(
        `[ERROR] : ล้มเหลวระหว่างการสร้าง payment charge สำหรับ omise -> ${error.message}`
      );
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: "ล้มเหลวระหว่างการสร้าง payment charge สำหรับ omise",
      });
    }
  }

  static async handleOmiseWebhookEvent(req: Request, res: Response) {
    try {
      const event = req.body;

      if (event.key === "charge.complete") {
        const {
          data: { metadata, status },
        } = event;

        if (metadata.action === PAYMENT_ACTIONS.TOP_UP_COINS) {
          if (status !== "successful") {
            return;
          }
          const { freelancerId, coins } = metadata;

          const freelancerInfo = await freelancerService.getFreelancerById(
            freelancerId
          );

          if (!freelancerInfo) {
            res.status(StatusCodes.NOT_FOUND).json({
              data: null,
              message: "ไม่พบข้อมูลฟรีแลนเซอร์",
            });
            return;
          }

          if (typeof coins !== "number") {
            res.status(StatusCodes.BAD_REQUEST).json({
              data: null,
              message: "จำนวนเหรียญต้องเป็นตัวเลข",
            });
            return;
          }

          await freelancerService.updateFreelanceInfo(freelancerId, {
            coins: (freelancerInfo?.coins ?? 0) + coins,
          });
        }
      }

      res.status(StatusCodes.OK).json({
        data: null,
        message: "จัดการ webhook event สำหรับ omise สำเร็จ",
      });
    } catch (error: any) {
      console.error(
        `[ERROR] : ล้มเหลวระหว่างการจัดการ webhook event สำหรับ omise -> ${error.message}`
      );
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: "ล้มเหลวระหว่างการจัดการ webhook event สำหรับ omise",
      });
    }
  }
}
