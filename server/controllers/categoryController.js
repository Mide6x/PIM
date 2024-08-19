const Category = require("../models/categoryModel");

// Fetch all categoris
exports.getCategories = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    const categories = await Category.find(query);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found 😔" });
    }
    res.json(category);
  } catch (err) {
    console.error("Error fetching category:", err.message);
  }
};

// Get all subcategories
exports.getSubcategories = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;

    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found 😔" });
    }

    res.json({ subcategories: category.subcategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Create a category
exports.createCategory = async (req, res) => {
  const category = new Category({
    name: req.body.name,
    subcategories: req.body.subcategories,
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found 😔" });
    }

    category.name = req.body.name;
    category.subcategories = req.body.subcategories;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Archive categories
exports.archiveCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found 😔" });
    }

    category.isArchived = true;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unarchive catefories
exports.unarchiveCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found 😔" });
    }

    category.isArchived = false;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found 😔" });
    }

    await Category.deleteOne({ _id: req.params.id });
    res.json({ message: "Category deleted 🫢" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
