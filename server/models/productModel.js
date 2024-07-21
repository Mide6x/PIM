const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  manufacturerName: { type: String, required: true },
  brand: { type: String, required: true },
  productCategory: { type: String, required: true },
  productSubcategory: { type: String, required: true  },
  productName: { type: String, required: true },
  variantType: { type: String, required: true },
  variant: { type: String, required: true },
  weight: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});
productSchema.index({ productName: 1, manufacturerName: 1, variant: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
