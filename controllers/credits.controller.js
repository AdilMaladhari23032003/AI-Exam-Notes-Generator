// ❌ REMOVE STRIPE IMPORT
// import Stripe from "stripe";

import razorpay from "../utils/razorpay.js";   // ✅ NEW
import crypto from "crypto";                  // ✅ NEW
import UserModel from "../models/user.model.js";

// ✅ SAME CREDIT MAP (जैसा तेरा था)
const CREDIT_MAP = {
  100: 50,
  200: 120,
  500: 300,
};

// =======================
// ✅ CREATE ORDER (NEW)
// =======================
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!CREDIT_MAP[amount]) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const options = {
      amount: amount * 100,   // paisa → paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// =======================
// ✅ VERIFY PAYMENT (NEW)
// =======================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const userId = req.userId;

    // ✅ SIGN VERIFY
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // ✅ ORDER FETCH
    const order = await razorpay.orders.fetch(razorpay_order_id);

    const amount = order.amount / 100;

    const creditsToAdd = CREDIT_MAP[amount];

    if (!creditsToAdd) {
      return res.status(400).json({ message: "Invalid credit mapping" });
    }

    // ✅ ADD CREDITS
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $inc: { credits: creditsToAdd },
        $set: { isCreditAvailable: true },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Payment successful",
      credits: user.credits,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};