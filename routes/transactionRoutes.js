const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const Group = require("../models/Group");

const router = express.Router();

// Make a Contribution
router.post("/contribute/:groupId", authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        const { groupId } = req.params;

        // Check if group exists
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        // Check if user is a group member
        if (!group.members.includes(req.user.id)) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        // // Check if amount matches group contribution amount
        // if (amount !== group.contributionAmount) {
        //     return res.status(400).json({ message: `Contribution amount must be ${group.contributionAmount}` });
        // }

        // Create transaction
        const transaction = new Transaction({
            user: req.user.id,
            group: groupId,
            amount,
            status: "completed"
        });

        await transaction.save();

        res.status(201).json({ message: "Contribution successful", transaction });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// View Contribution History
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).populate("group", "name");
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Withdraw Savings (Only Group Creator Can Withdraw)
router.post("/withdraw/:groupId", authMiddleware, async (req, res) => {
    try {
        const { groupId } = req.params;
        const { amount } = req.body;

        // Check if group exists
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        // Only the group creator can withdraw
        if (group.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only the group creator can withdraw" });
        }

        // Calculate total contributions
        const totalSavings = await Transaction.aggregate([
            { $match: { group: group._id, status: "completed" } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);

        const totalAmount = totalSavings.length > 0 ? totalSavings[0].totalAmount : 0;

        // Check if requested withdrawal amount is valid
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid withdrawal amount" });
        }

        if (amount > totalAmount) {
            return res.status(400).json({ message: `Insufficient funds. Available: ${totalAmount}` });
        }

        res.status(200).json({ message: "Withdrawal successful", amountWithdrawn: amount });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
