const mongoose = require("mongoose");

const paymentDetailSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  transactionId: { type: String, required: true },
  orderDate: { type: Date, required: true },
  paymentStatus: { type: String, required: true },
  orderStatus: { type: String, required: true },
  customerPhoneNumber: { type: String, required: true },
  customerEmailId: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  address: [
    {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("PaymentDetail", paymentDetailSchema);
