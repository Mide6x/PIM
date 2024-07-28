require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/authRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoute");
const manufacturerRoutes = require("./routes/manufacturerRoutes");
const imageRoutes = require("./routes/imageRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const processedImageRoutes = require('./routes/processedImageRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/manufacturer", manufacturerRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/processedimages", processedImageRoutes);

// Error handling - Global
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is Running on Port: ${PORT}`);
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connection With Database Established. 🎉"))
  .catch((error) =>
    console.error("Failed 😔 to Establish Connection With Database:", error)
  );
