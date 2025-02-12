// routes/recommendations.route.js
import express from "express";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

const router = express.Router();

// Get recommended products for a user based on past purchases
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all orders for the user
    const orders = await Order.find({ userId }).populate("products.productId");

    // Gather categories from purchased products
    const purchasedCategories = orders.reduce((acc, order) => {
      order.products.forEach(({ productId }) => {
        if (productId && productId.category) {
          acc.add(productId.category);
        }
      });
      return acc;
    }, new Set());

    // Fetch other products in the same categories (excluding already purchased ones)
    const recommendations = await Product.find({
      category: { $in: Array.from(purchasedCategories) },
      _id: { $nin: orders.flatMap((order) => order.products.map((p) => p.productId)) },
    }).limit(8); // Limit to 8 recommendations for now

    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ success: false, message: "Error fetching recommendations" });
  }
});

export default router;
