const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    username: String,
    pwd: String,
    fullname: String,
    contact: Object,
    gender: String,
    dob: String,
    profile_url: String,
    card_details: [Object],
    address: {
      x: String,
      y: String
    },
    cart: [
      {
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
        quantity: Number,
        color: String,
        size: String
      }
    ],
    orders: [
      {type: mongoose.Schema.Types.ObjectId, ref: 'order'}
    ],
    newsletter: Boolean,
    active:{type: Boolean, default: false},
    creadted_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model("user", userSchema);