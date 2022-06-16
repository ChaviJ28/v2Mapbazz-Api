const mongoose = require("mongoose");

var categorySchema = mongoose.Schema({
    title: String,
    creadted_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model("category", categorySchema);