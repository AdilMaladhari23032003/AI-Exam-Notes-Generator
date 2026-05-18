// ❌ OLD
// createCreditsOrder
// stripeWebhook

// ✅ NEW
import express from "express";
import isAuth from "../middleware/isAuth.js";
import { createOrder, verifyPayment } from "../controllers/credits.controller.js";

const router = express.Router();

// ✅ NEW ROUTES
router.post("/create-order", isAuth, createOrder);
router.post("/verify", isAuth, verifyPayment);

export default router;