const mongoose = require("mongoose");

const processedImageSchema = new mongoose.Schema({
  manufacturerName: { type: String },
  brand: { type: String },
  productName: { type: String },
  productCategory: { type: String },
  variantType: { type: String },
  variant: { type: String },
  weight: { type: String },
  imageUrl: { type: String },
});
processedImageSchema.index(
  { productName: 1, variant: 1, weight: 1 },
  { unique: true }
);

const ProcessedImage = mongoose.model("ProcessedImage", processedImageSchema);

module.exports = ProcessedImage;
