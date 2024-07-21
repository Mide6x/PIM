const express = require("express");
const router = express.Router();
const approvalController = require("../controllers/approvalController");

// Get all products awaiting approval
router.get("/", approvalController.getAllAwaitingApproval);

// Create products awaiting approval
router.post("/", approvalController.createApproval);

// Update a product awaiting approval
router.put("/:id", approvalController.updateApproval);

// Delete a product awaiting approval
router.delete("/:id", approvalController.deleteApproval);

module.exports = router;
