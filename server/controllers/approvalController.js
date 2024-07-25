const Approval = require("../models/approvalModel");

// Get all products awaiting approval
exports.getAllAwaitingApproval = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    const approvals = await Approval.find(query);
    res.status(200).json(approvals);
  } catch (error) {
    next(error);
    res.status(500).json({ message: error.message });
  }
};

// Create new products awaiting approval
exports.createApproval = async (req, res, next) => {
  try {
    const products = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const createdApprovals = [];
    for (const productData of products) {
      const approval = new Approval({
        manufacturerName: productData.manufacturerName,
        brand: productData.brand,
        productCategory: productData.productCategory,
        productSubcategory: productData.productSubcategory,
        productName: productData.productName,
        variantType: productData.variantType,
        variant: productData.variant,
        weightInKg: productData.weightInKg,
        imageUrl: productData.imageUrl,
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
    const updateData = req.body;

    if (updateData.productSubcategory === undefined) {
      updateData.productSubcategory = "";
    }

    const updatedApproval = await Approval.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedApproval) {
      return res.status(404).json({ message: "Product not found 😔" });
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
      return res.status(404).json({ message: "Product not found 😔" });
    }
    res.status(204).json({ message: "Product deleted 🫢" });
  } catch (error) {
    next(error);
  }
};
