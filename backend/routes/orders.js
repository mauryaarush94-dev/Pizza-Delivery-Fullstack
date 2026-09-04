const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { base, sauce, cheese, vegetables, amount } = req.body;

    const order = await Order.create({
      userId: decoded.id,
      base,
      sauce,
      cheese,
      vegetables,
      amount
    });

    res.json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    console.log("Order error:", error.message);

    res.status(500).json({
      message: "Could not create order"
    });
  }
});

module.exports = router;