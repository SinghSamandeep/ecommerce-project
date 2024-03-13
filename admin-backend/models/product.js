const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  modelNumber: { type: String, required: true },
  productImages: [{ type: String }], // URLs of images
  price: { type: Number, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
