const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  addProduct,
  fetchProducts,
  fetchProductDetails,
  editProduct,
  deleteProduct,
  searchProduct,
} = require("../controllers/productController");
const verifyRole = require("../middleware/verifyRole");
const { authenticateToken } = require("../middleware/authenticate");

router.post(
  "/add",
  authenticateToken,
  verifyRole(["admin", "editor"]),
  addProduct
);
router.get("/fetch", fetchProducts);
router.get("/search", searchProduct);
router.get("/:id", fetchProductDetails);
router.put("/:id", upload, editProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
