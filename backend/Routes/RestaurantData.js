const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");

router.get("/allRestaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json({ success: true, restaurants });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Erro do servidor");
  }
});

router.get("/restaurant/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurante não encontrado" });
    }
    res.json({ success: true, restaurant });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Erro do servidor");
  }
});

router.post("/addRestaurant", async (req, res) => {
  try {
    const { name, status, waitTime, rating } = req.body;
    const restaurant = await Restaurant.create({
      name,
      status,
      waitTime,
      rating: rating || 0,
    });
    res.json({ success: true, restaurant });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Erro do servidor");
  }
});

router.put("/updateRestaurant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, waitTime, rating } = req.body;
    const updated = await Restaurant.findByIdAndUpdate(
      id,
      { name, status, waitTime, rating },
      { new: true }
    );
    res.json({ success: true, restaurant: updated });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Erro do servidor");
  }
});

router.delete("/deleteRestaurant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Erro do servidor");
  }
});

module.exports = router;
