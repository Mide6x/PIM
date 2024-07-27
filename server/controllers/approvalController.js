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
// Bulk approve products
exports.bulkApprove = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid data format or empty list" });
    }

    const result = await Approval.updateMany(
      { _id: { $in: ids } },
      { $set: { status: "approved" } },
      { multi: true }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "No products found to approve" });
    }

    res.status(200).json({ message: "Products approved successfully", result });
  } catch (error) {
    next(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//delete approved
exports.deleteAllApprovedProducts = async (req, res, next) => {
  try {
    const deletedCount = await Approval.deleteMany({ status: "approved" });
    res.status(200).json({ message: `${deletedCount} approved products deleted successfully` });
  } catch (error) {
    next(error);
    res.status(500).json({ error: "Failed to delete approved products" });
  }
};


// Delete duplicate products by IDs
exports.deleteDuplicates = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid data format or empty list" });
    }

    const result = await Approval.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No duplicate products found to delete 😔" });
    }
    res.status(200).json({ message: "Duplicate products deleted successfully 🎉" });
  } catch (error) {
    next(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

