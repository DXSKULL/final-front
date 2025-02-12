// store/cart.js
import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],

  fetchCart: async (userId) => {
    if (!userId) {
      console.error("User ID is missing in fetchCart");
      return;
    }
    try {
      const res = await fetch(`/api/cart/${userId}`);
      const data = await res.json();
      set({ cart: data.products || [] }); // Ensure only current user’s cart is loaded
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  },

  addToCart: async (userId, productId) => {
    if (!userId || !productId) {
      console.error("User ID or Product ID is missing in addToCart");
      return;
    }
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error adding to cart:", error.message);
        return;
      }

      console.log("Product added to cart successfully");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  },
  
  removeFromCart: async (userId, productId) => {
    if (!userId || !productId) {
      console.error("User ID or Product ID is missing in removeFromCart");
      return;
    }
    try {
      const res = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error removing from cart:", error.message);
        return;
      }

      // Remove the product from the cart state after successful deletion
      set((state) => ({
        cart: state.cart.filter((item) => item.productId._id !== productId),
      }));

      console.log("Product removed from cart successfully");
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
    }
  },

  placeOrder: async (userId) => {
    if (!userId) {
      console.error("User ID is missing in placeOrder");
      return;
    }
    const res = await fetch("/api/orders/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return data;
  },
}));
