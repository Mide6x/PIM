const Product = require("../models/productModel");

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.bulkCreateProducts = async (req, res, next) => {
  try {
    const products = req.body;

    // Validate the data
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Create products
    const createdProducts = [];
    for (const productData of products) {
      const product = new Product({
        manufacturerName: productData.manufacturerName,
        brand: productData.brand,
        productCategory: productData.productCategory,
        productName: productData.productName,
        variantType: productData.variantType,
        variant: productData.variant,
        weight: productData.weightInKg,
        imageUrl: productData.imageUrl,
      });

      const savedProduct = await product.save();
      createdProducts.push(savedProduct);
    }

    res.status(201).json(createdProducts);
  } catch (error) {
    console.error("Error saving products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Create a new product
exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

// Create multiple products (Bulk creation)
exports.createProducts = async (req, res, next) => {
  try {
    const products = req.body;

    // Validate the data
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Create products
    const createdProducts = [];
    for (const productData of products) {
      const product = new Product({
        manufacturerName: productData["Manufacturer Name"],
        brand: productData["Brand"],
        productCategory: productData["Product Category"],
        productName: productData["Product Name"],
        variantType: productData["Variant Type"],
        variant: productData["Variant"],
        weight: productData["Weight"],
        imageUrl: productData["Image URL"],
      });

      const savedProduct = await product.save();
      createdProducts.push(savedProduct);
    }

    res.status(201).json(createdProducts);
  } catch (error) {
    console.error("Error saving products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
