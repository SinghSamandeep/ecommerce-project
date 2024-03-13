const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  assignRole,
} = require("../controllers/userController");
const verifyRole = require("../middleware/verifyRole");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/assign-role", verifyRole(["admin"]), assignRole);

module.exports = router;
