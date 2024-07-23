const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subcategories: [
    {
      type: String,
      required: true,
    },
  ],
  isArchived: { type: Boolean, default: false }, 
});

module.exports = mongoose.model("Category", categorySchema);
