const Variant = require('../models/variantModel');

// @desc    Get all variants
// @route   GET /api/v1/variants
exports.getVariants = async (req, res, next) => {
  try {
    const variants = await Variant.find().populate('createdBy', 'email name');
    res.status(200).json({
      status: 'success',
      results: variants.length,
      data: variants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new variant
// @route   POST /api/v1/variants
exports.createVariant = async (req, res) => {
  try {
    const { name, subvariants, createdBy } = req.body;

    // Correctly access the name property for each subvariant before trimming
    const trimmedSubvariants = subvariants.map((sub) => ({
      ...sub,
      name: sub.name.trim(),  // Trim the name of each subvariant
    }));

    const newVariant = new Variant({
      name: name.trim(),
      subvariants: trimmedSubvariants,
      createdBy,
    });

    await newVariant.save();
    res.status(201).json({ success: true, data: newVariant });
  } catch (error) {
    console.error("Error creating variant:", error);
    res.status(500).json({ success: false, message: "Error creating variant", error });
  }
};


// @desc    Update a variant
// @route   PUT /api/v1/variants/:id
exports.updateVariant = async (req, res, next) => {
  try {
    const { name, subvariants } = req.body;
    const variantId = req.params.id;

    const variant = await Variant.findById(variantId);
    if (!variant) {
      return res.status(404).json({
        status: 'fail',
        message: 'Variant not found.',
      });
    }

    if (name && name.trim() !== variant.name) {
      const existingVariant = await Variant.findOne({ name: name.trim() });
      if (existingVariant) {
        return res.status(400).json({
          status: 'fail',
          message: 'Another variant with this name already exists.',
        });
      }
      variant.name = name.trim();
    }
    if (subvariants) {
      variant.subvariants = subvariants.map((sub) => ({ name: sub.trim() }));
    }

    await variant.save();

    res.status(200).json({
      status: 'success',
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a variant
// @route   DELETE /api/v1/variants/:id
exports.deleteVariant = async (req, res, next) => {
  try {
    const variantId = req.params.id;
    const variant = await Variant.findByIdAndDelete(variantId);

    if (!variant) {
      return res.status(404).json({
        status: 'fail',
        message: 'Variant not found.',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a subvariant to a variant
// @route   POST /api/v1/variants/:id/subvariants
exports.addSubVariant = async (req, res, next) => {
  try {
    const variantId = req.params.id;
    const { name } = req.body;

    const variant = await Variant.findById(variantId);
    if (!variant) {
      return res.status(404).json({
        status: 'fail',
        message: 'Variant not found.',
      });
    }
    if (variant.subvariants.some((sub) => sub.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Subvariant with this name already exists.',
      });
    }

    variant.subvariants.push({ name: name.trim() });
    await variant.save();

    res.status(201).json({
      status: 'success',
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a subvariant from a variant
// @route   DELETE /api/v1/variants/:id/subvariants/:subId
exports.deleteSubVariant = async (req, res, next) => {
  try {
    const { id, subId } = req.params;

    const variant = await Variant.findById(id);
    if (!variant) {
      return res.status(404).json({
        status: 'fail',
        message: 'Variant not found.',
      });
    }

    const subvariant = variant.subvariants.id(subId);
    if (!subvariant) {
      return res.status(404).json({
        status: 'fail',
        message: 'Subvariant not found.',
      });
    }

    subvariant.remove();
    await variant.save();

    res.status(200).json({
      status: 'success',
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};
