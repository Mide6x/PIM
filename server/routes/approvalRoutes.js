const express = require("express");
const router = express.Router();
const approvalController = require("../controllers/approvalController");

router.get("/", approvalController.getAllAwaitingApproval);
router.post("/", approvalController.createApproval);
router.put("/:id", approvalController.updateApproval);
router.delete("/:id", approvalController.deleteApproval);
router.delete('/delete-approved', approvalController.deleteApprovedProducts);
router.post('/bulk-approve', approvalController.bulkApprove);
router.post('/delete-duplicates', approvalController.deleteDuplicates);

module.exports = router;
