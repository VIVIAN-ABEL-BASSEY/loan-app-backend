const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    groupName: { type: String, required: true },
    maxNoMem:{type:Number, required:true},
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    contributionAmount: { type: Number, required: true },
    frequency: { type: String, required: true }, // e.g., Weekly, Monthly The props I'll be passing are: groupName,Amount,Max number of members,Frequency,
    duration: { type: Number, required: true }, // e.g., 6 months
    startDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Group", GroupSchema);
