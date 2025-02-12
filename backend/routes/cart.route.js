// routes/cart.route.js
import express from "express";
import Cart from "../models/cart.model.js";

const router = express.Router();

// Add a product to the cart for a specific user
router.post("/add", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find the cart associated with this user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({ userId, products: [{ productId, quantity: 1 }] });
    } else {
      // If cart exists, check if the product is already in the cart
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

      if (productIndex !== -1) {
        // Product exists in the cart, so increment quantity
        cart.products[productIndex].quantity += 1;
      } else {
        // Product does not exist, so add it to the cart
        cart.products.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Product added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
});

// Get cart items for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("products.productId");

    if (!cart) {
      return res.status(200).json({ products: [] }); // Return an empty cart if no cart exists
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).json({ success: false, message: "Error retrieving cart" });
  }
});

// Remove a product from the cart
router.delete("/remove", async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found" });
      }
  
      // Filter out the product to be removed
      cart.products = cart.products.filter(p => p.productId.toString() !== productId);
  
      await cart.save();
      res.status(200).json({ success: true, message: "Product removed from cart" });
    } catch (error) {
      console.error("Error removing product from cart:", error);
      res.status(500).json({ success: false, message: "Error removing product from cart" });
    }
  });

export default router;
