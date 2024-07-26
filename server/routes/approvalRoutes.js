const express = require("express");
const router = express.Router();
const approvalController = require("../controllers/approvalController");

router.get("/", approvalController.getAllAwaitingApproval);
router.post("/", approvalController.createApproval);
router.put("/:id", approvalController.updateApproval);
router.delete("/:id", approvalController.deleteApproval);
router.delete('/delete-all-approved', approvalController.deleteAllApproved);
router.post('/bulk-approve', approvalController.bulkApprove);

module.exports = router;
