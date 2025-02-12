import express from 'express';
import dotenv from "dotenv"
import { connectDB } from './config/db.js'
import productRoutes from "./routes/product.route.js"
import authRoutes from "./routes/auth.route.js"; // Import auth routes
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import recommendationsRoutes from "./routes/recommendations.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json()); // allows to accept JSON data in req.body

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes); // Add auth routes
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/recommendations", recommendationsRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log("Started at http://localhost:" + PORT)
})