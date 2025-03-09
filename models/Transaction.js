const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
