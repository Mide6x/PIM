const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/authRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoute");
const manufacturerRoutes = require("./routes/manufacturerRoutes");
const imageRoutes = require("./routes/imageRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
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
app.use("/api/processedimages", require('./routes/processedImageRoutes'));

// MongoDB connect
mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => console.log("Connection With Database Established. 🎉"))
  .catch((error) =>
    console.error("Failed 😔 to Establish Connection With Database:", error)
  );

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
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is Running on Port: ${PORT}`);
});
