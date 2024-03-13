require("dotenv").config({
  path: "./config/config.env",
});
const app = require("./app");
const mongoose = require("mongoose");

const result = require("dotenv").config({
  path: "./config/config.env",
});
console.log(result);
// Database Connection
mongoose
  .connect("mongodb://localhost:27017/WatchEcommerce")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
