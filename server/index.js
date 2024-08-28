require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require("path");

// Route imports
const authRouter = require("./routes/authRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoute");
const manufacturerRoutes = require("./routes/manufacturerRoutes");
const imageRoutes = require("./routes/imageRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const processedImageRoutes = require('./routes/processedImageRoutes');
const userRoutes = require('./routes/userRoute');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const _dirname = path.resolve();

console.log("dirname", _dirname )

// Middleware
app.use(cors());
app.use(express.json());

// Route middlewares
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/manufacturer", manufacturerRoutes);
app.use("/api/v1/images", imageRoutes);
app.use("/api/v1/approvals", approvalRoutes);
app.use("/api/v1/processedimages", processedImageRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Swagger setup
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'PIM Swagger API',
      version: '1.0.0',
      description: 'PIM API Documentation for SABI',
      contact: {
        name: 'AI Team',
        email: 'olumide.adewole@sabi.am',
      }
    },
    servers:[
      {
        url: 'https://prod-nnal.onrender.com/'
      }
    ]
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is Running on Port: ${PORT}`);
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connection With Database Established. 🎉"))
  .catch((error) =>
    console.error("Failed 😔 to Establish Connection With Database:", error)
  );