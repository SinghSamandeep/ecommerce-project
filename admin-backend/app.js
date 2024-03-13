const express = require("express");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoute");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);

app.use(errorHandler);

module.exports = app;
