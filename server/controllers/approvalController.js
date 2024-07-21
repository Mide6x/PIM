// controllers/approvalController.js
const Approval = require("../models/approvalModel");

// Get all products awaiting approval
exports.getAllAwaitingApproval = async (req, res, next) => {
  try {
    const approvals = await Approval.find();
    res.status(200).json(approvals);
  } catch (error) {
    next(error);
  }
};

// Create a new product awaiting approval
exports.createApproval = async (req, res, next) => {
  try {
    const products = req.body;

  
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

 
    const createdApprovals = [];
    for (const productData of products) {
      const approval = new Approval({
        manufacturerName: productData["Manufacturer Name"],
        brand: productData["Brand"],
        productCategory: productData["Product Category"],
        productName: productData["Product Name"],
        variantType: productData["Variant Type"],
        variant: productData["Variant"],
        weightInKg: productData["Weight (in Kg)"],
        imageUrl: productData["Image URL"],
      });

      const savedApproval = await approval.save();
      createdApprovals.push(savedApproval);
    }

    res.status(201).json(createdApprovals);
  } catch (error) {
    console.error("Error saving products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Update a product awaiting approval by ID
exports.updateApproval = async (req, res, next) => {
  try {
    const updatedApproval = await Approval.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedApproval) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedApproval);
  } catch (error) {
    next(error);
  }
};

// Delete a product awaiting approval by ID
exports.deleteApproval = async (req, res, next) => {
  try {
    const deletedApproval = await Approval.findByIdAndDelete(req.params.id);
    if (!deletedApproval) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
