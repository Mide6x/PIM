const mongoose = require("mongoose");

const subvariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A subvariant must have a name"],
  },
});

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A variant must have a name"],
    unique: true,
  },
  subvariants: [subvariantSchema],
  createdBy: {
    type: String,
    required: [true, "A variant must have a creator"],
  },
});

const Variant = mongoose.model("Variant", variantSchema);

module.exports = Variant;
