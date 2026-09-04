const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    base: String,
    sauce: String,
    cheese: String,
    vegetables: [String],

    amount: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      default: "Pending"
    },

    orderStatus: {
      type: String,
      default: "Order Received"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);