const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    orderIds: [{ type: String }],       
    cardNumber: { type: String, required: true },
    validity: { type: String, required: true },
    cvc: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);