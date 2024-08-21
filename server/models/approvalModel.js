const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema({
  manufacturerName: { type: String, required: true },
  brand: { type: String, required: true },
  productCategory: { type: String, required: true },
  productSubcategory: { type: String, required: true },
  productName: { type: String, required: true },
  variantType: { type: String, required: true },
  variant: { type: String, required: true },
  weightInKg: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  createdBy: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: { type: String },
});

const Approval = mongoose.model("Approval", approvalSchema);

module.exports = Approval;
