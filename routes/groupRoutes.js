const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Group = require("../models/Group");

const router = express.Router();

// Create Group
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { name, contributionAmount, frequency, duration, startDate } = req.body;

        if (!name || !contributionAmount || !frequency || !duration || !startDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newGroup = new Group({
            name,
            createdBy: req.user.id,
            members: [req.user.id], // Creator is first member
            contributionAmount,
            frequency,
            duration,
            startDate,
        });

        await newGroup.save();
        res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Join Group
router.post("/join/:groupId", authMiddleware, async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);

        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.members.includes(req.user.id)) {
            return res.status(400).json({ message: "You are already in this group" });
        }

        group.members.push(req.user.id);
        await group.save();

        res.status(200).json({ message: "Joined group successfully", group });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// List All Groups
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// View Group Details
router.get("/:groupId", authMiddleware, async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId).populate("members", "name email");

        if (!group) return res.status(404).json({ message: "Group not found" });

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
