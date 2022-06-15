const mongoose = require("mongoose");

var adminSchema = mongoose.Schema({
    username: String,
    creadted_on: { $type: Date, default: Date.now },
    pwd: String,
    full_name: String,
    email: String,
}, { typeKey: "$type" });

module.exports = mongoose.model("admin", adminSchema);