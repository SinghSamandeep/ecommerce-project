const jwt = require("jsonwebtoken");
const errorHandler = require("../middleware/asyncErrorHandler");

exports.authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Bearer scheme

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the same secret key used for generating the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded user information to the request object
    next(); // Proceed to the next middleware or request handler
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

exports.springReqAuth = errorHandler(async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  next();
});
