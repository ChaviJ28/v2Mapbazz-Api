const mongoose = require("mongoose");

var productSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discount: Number,
    colors: [String],
    images: [
        {
            url: String,
            color: String
        }
    ],
    stock: Number,
    shown: {type: Boolean, default: false},
    size: [String],
    category: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'category'}
    ],
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'shop' },
    creadted_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model("product", productSchema);