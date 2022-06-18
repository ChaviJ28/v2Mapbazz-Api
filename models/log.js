const mongoose = require("mongoose");

var logSchema = mongoose.Schema({
    title: String,
    creadted_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model("log", logSchema);