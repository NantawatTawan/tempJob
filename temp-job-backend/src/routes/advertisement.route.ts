import { Router } from "express";
import {
  getAllAdvertisements,
  deleteAdvertisementById,
  getAdvertisementById,
  updateAdvertisementById,
  createAdvertisement,
} from "../controllers/advertisement.controller";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware";

const advertisementRouter = Router();

advertisementRouter.get("/", getAllAdvertisements);
advertisementRouter.get("/:id", getAdvertisementById);
advertisementRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteAdvertisementById
);
advertisementRouter.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateAdvertisementById
);
advertisementRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createAdvertisement
);

export default advertisementRouter;
