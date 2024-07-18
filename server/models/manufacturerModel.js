const mongoose = require("mongoose");

const manufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema);

module.exports = Manufacturer;
