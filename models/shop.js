const mongoose = require("mongoose");

var shopSchema = mongoose.Schema({
    brand_name: String,
    trade_name: String,
    creadted_on: { type: Date, default: Date.now },
    logo: String,
    color: String,
    is_active: Boolean,
    subscription_type: String,
    owner: {
        username: String,
        pwd: String,
        name: String,
        login_count: { type: Number, default: 0 },
    },
    contact: Object,
    banner: [String],
    category: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
    ],
});

module.exports = mongoose.model("shop", shopSchema);