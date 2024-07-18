const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  manufacturerName: { type: String, required: true },
  brand: { type: String, required: true },
  productCategory: { type: String, required: true },
  productName: { type: String, required: true },
  variantType: { type: String, required: true },
  variant: { type: String, required: true },
  weight: { type: Number, required: true },
  imageUrl1: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
