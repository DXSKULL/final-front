// routes/order.route.js
import express from "express";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

const router = express.Router();

router.post("/place", async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const order = new Order({
      userId,
      products: cart.products,
      status: "Placed",
    });

    await order.save();
    await Cart.deleteOne({ userId });

    res.status(200).json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error placing order" });
  }
});

export default router;
