const mongoose = require("mongoose");

var orderSchema = mongoose.Schema({
    user: {
      type:mongoose.Schema.Types.ObjectId, ref: 'user'
    },
    price: Number,
    address: {
      x: String, 
      y: String
    },
    payment_type: Object,
    paid_sts: {type: Boolean, default: false},
    del_comment: String,
    del_status: String,
    on_delivered_comment: String,
    items: [
      {
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
        quantity: Number,
        color: String,
        size: String
      }
    ],
    creadted_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model("order", orderSchema);