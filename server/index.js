const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/authRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.use("/api/auth", authRouter);

// MongoDB connect
mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => console.log("Connection With Database Established."))
  .catch((error) =>
    console.error("Failed to Establish Connection With Database:", error)
  );

// Global error handling
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
