import express from "express";
import collectionRoutes from "./collectionRoutes";
import userRoutes from "./userRoutes";
import timelineRoutes from "./timelineRoutes";
import analyticsRoutes from "./analyticsRoutes";
import paymentRoutes from "./paymentRoutes";
import lemonsqueezy from "./lemonsqueezy";
const router = express.Router();

// User
router.use("/user", userRoutes);

// Collection
router.use("/collections", collectionRoutes);

// Timeline
router.use("/collections/:id/timelines", timelineRoutes);

// Analytics
router.use("/analytics", analyticsRoutes);

// Stripe
router.use("/payments", paymentRoutes);

router.use("/lemonsqueezy", lemonsqueezy)

export default router;
