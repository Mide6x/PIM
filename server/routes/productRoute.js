const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.post('/bulk', productController.bulkCreateProducts);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);
  

router
  .route("/:id")
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);


module.exports = router;
