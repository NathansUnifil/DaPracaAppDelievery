const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

router.post("/processPayment", async (req, res) => {
  try {
    const { email, orderIds, cardNumber, validity, cvc } = req.body;

    if (!email || !cardNumber || !validity || !cvc) {
      return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios." });
    }

    const ids = Array.isArray(orderIds) ? orderIds : [orderIds];

    const payment = await Payment.create({
      email,
      orderIds: ids,
      cardNumber,
      validity,
      cvc,
    });

    res.json({ success: true, payment });
  } catch (error) {
    console.error("Erro ao processar pagamento:", error.message);
    res.status(500).send("Erro do servidor");
  }
});

module.exports = router;