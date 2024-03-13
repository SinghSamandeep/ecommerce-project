const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorHandler = require("../middleware/asyncErrorHandler");
const stripe = require("stripe")(
  "sk_test_51HAv02BiD8D8U9qJwf1xTyki9GQCOeMvimIpN9LPOEdgEWIbonCMmYBJchCHLbTSPgzVZ1g91E6uOn6zDegb2ONt00d1MSsFKM"
);

exports.registerUser = errorHandler(async (req, res) => {
  const { username, mobileNumber, emailId, password } = req.body;
  const employeeId = `${username}${mobileNumber.slice(0, 4)}`;

  const existingUser = await User.findOne({
    $or: [{ emailId }, { mobileNumber }, { username }],
  });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    username,
    mobileNumber,
    employeeId,
    emailId,
    password: hashedPassword,
    role: "support",
  });
  newUser.save();
  res
    .status(201)
    .json({ message: "User registered successfully", userId: newUser._id });
});

exports.loginUser = errorHandler(async (req, res) => {
  const { emailId, password } = req.body;

  const user = await User.findOne({ emailId });
  if (!user) {
    return res.status(401).json({ message: "Login failed" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.employeId, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token,
    userId: user._id,
    role: user.role,
  });
});

exports.assignRole = errorHandler(async (req, res) => {
  const { userId, role } = req.body;

  if (!["admin", "editor", "support"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = role;
  await user.save();

  res.status(200).json({ message: "Role updated successfully" });
});
