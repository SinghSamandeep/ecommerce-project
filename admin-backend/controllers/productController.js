const Product = require("../models/product");
const upload = require("../utils/multer");
const errorHandler = require("../middleware/asyncErrorHandler");

exports.addProduct = errorHandler(async (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ message: err });
    } else {
      if (req.files === undefined) {
        res.status(400).json({ message: "No file selected" });
      } else {
        const { name, modelNumber, price, description } = req.body;
        const productImages = req.files.map((file) => file.path);

        const product = new Product({
          name,
          modelNumber,
          productImages,
          price,
          description,
        });
        product
          .save()
          .then(() =>
            res
              .status(201)
              .json({ message: "Product added successfully", product })
          )
          .catch((error) => next(error));
      }
    }
  });
});

exports.fetchProducts = errorHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const count = await Product.countDocuments();
  const products = await Product.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const totalPages = Math.ceil(count / limit);

  res.status(200).json({
    products,
    totalPages,
    currentPage: parseInt(page, 10),
    totalProducts: count,
  });
});

exports.fetchProductDetails = errorHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found!" });
  }
  res.status(200).json(product);
});

exports.editProduct = errorHandler(async (req, res) => {
  const { name, modelNumber, price, description, existingProductImages } =
    req.body;
  let productImages = existingProductImages
    ? JSON.parse(existingProductImages)
    : [];

  if (req.files) {
    const uploadedImages = req.files.map((file) => file.path);
    productImages = [...productImages, ...uploadedImages];
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, modelNumber, price, description, productImages },
      { new: true }
    );

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating product.", error: error.toString() });
  }
});

exports.deleteProduct = errorHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found!" });
  }
  res.status(204).json({ message: "Product deleted successfully!" });
});

exports.searchProduct = errorHandler(async (req, res) => {
  let queryObj = {};
  console.log(req.query);
  const { text, price, modelNumber } = req.query;

  if (text) {
    queryObj.$or = [
      { name: { $regex: text, $options: "i" } },
      { description: { $regex: text, $options: "i" } },
    ];
  }

  if (price) {
    queryObj.price = price;
  }

  if (modelNumber) {
    queryObj.modelNumber = modelNumber;
  }
  const { page = 1, limit = 10 } = req.query;
  const count = await Product.countDocuments();

  try {
    const results = await Product.find(queryObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      results,
      totalPages,
      currentPage: parseInt(page, 10),
      totalProducts: count,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
});
