const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    contributionAmount: { type: Number, required: true },
    frequency: { type: String, required: true }, // e.g., Weekly, Monthly
    duration: { type: Number, required: true }, // e.g., 6 months
    startDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Group", GroupSchema);
