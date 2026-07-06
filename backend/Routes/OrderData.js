const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

router.post("/orderData", async (req, res) => {
  let data = req.body.order_data;
  await data.splice(0, 0, { Order_date: req.body.order_date });
  for (let i = 1; i < data.length; i++) {
    data[i].itemId = new ObjectId().toString();
  }

  //Se o email não existir na mangoDB, então é criado.
  //Se não: InsertMany()
  let eId = await Order.findOne({ email: req.body.email });
  if (eId === null) {
    try {
      await Order.create({
        email: req.body.email,
        order_data: [data],
      }).then(() => {
        res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      res.send("Erro do servidor", error.message);
    }
  } else {
    try {
      await Order.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: data } }
      ).then(() => {
        res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      res.send("Erro do servidor", error.message);
    }
  }
});

router.post("/myOrderData", async (req, res) => {
  try {
    let myData = await Order.findOne({ email: req.body.email });
    res.json({ orderData: myData });
  } catch (error) {
    res.send("Erro do servidor", error.message);
  }
});

router.post("/deleteOrderItems", async (req, res) => {
  try {
    const { email, itemIds } = req.body;

    if (!email || !itemIds || !Array.isArray(itemIds)) {
      return res.status(400).json({ success: false, message: "Dados inválidos." });
    }

    const orderDoc = await Order.findOne({ email });

    if (!orderDoc) {
      return res.status(404).json({ success: false, message: "Pedido não encontrado." });
    }
    const itemsToDelete = itemIds.map(idStr => {
      const parts = idStr.split("_");
      const itemIndex = parseInt(parts.pop(), 10);
      const groupIndex = parseInt(parts.pop(), 10);
      return { groupIndex, itemIndex };
    });
    let updatedOrderData = orderDoc.order_data.map((group, gIdx) => {
      return group.filter((item, iIdx) => {
        if (item.Order_date) return true;
        return !itemsToDelete.some(
          del => del.groupIndex === gIdx && del.itemIndex === iIdx
        );
      });
    }).filter(group => group.length > 0); 

    orderDoc.order_data = updatedOrderData;
    await orderDoc.save();

    res.json({ success: true, message: "Itens removidos com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar itens:", error.message);
    res.status(500).json({ success: false, message: "Erro do servidor." });
  }
});

module.exports = router;