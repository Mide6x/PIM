const Product = require("../models/productModel");

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = search
      ? { productName: { $regex: search, $options: "i" } }
      : {};
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    next(error);
    res.status(500).json({ message: error.message });
  }
};

//Bulk creeation
exports.bulkCreateProducts = async (req, res, next) => {
  try {
    const products = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const validProducts = products.filter(
      (productData) => productData.productCategory.toLowerCase() !== "unknown"
    );

    const createdProducts = await Product.insertMany(
      validProducts.map((productData) => ({
        manufacturerName: productData.manufacturerName,
        brand: productData.brand,
        productCategory: productData.productCategory,
        productSubcategory: productData.productSubcategory,
        productName: productData.productName,
        variantType: productData.variantType,
        variant: productData.variant,
        weight: productData.weightInKg,
        imageUrl: productData.imageUrl,
        description: productData.description,
        createdBy: productData.createdBy,
      }))
    );

    res.status(201).json(createdProducts);
  } catch (error) {
    console.error("Error saving products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Cgeck for duplicates
exports.checkForDuplicates = async (req, res) => {
  try {
    const products = req.body;

    const duplicateNames = new Set();
    for (const productData of products) {
      const existingProduct = await Product.findOne({
        productName: productData.productName,
        manufacturerName: productData.manufacturerName,
        variant: productData.variant,
      });

      if (existingProduct) {
        duplicateNames.add(productData.productName);
      }
    }

    res.status(200).json(Array.from(duplicateNames));
  } catch (error) {
    res.status(500).json({ error: "Failed to check for duplicates 😔" });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found 😔" });
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

// Update a product by ID
exports.updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found 😔" });
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
      return res.status(404).json({ message: "Product not found 😔" });
    }
    res.status(204).json({ message: "Product deleted 🫢" });
  } catch (error) {
    next(error);
  }
};
