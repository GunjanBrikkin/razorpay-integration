const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: Number,
  payment_amount: { type: Number , default : 0.0 },
  payment_Status: { type: String , enum : ["Done","Pending","Cancled"], default : "Pending" }
});

module.exports = mongoose.model("User", userSchema);
