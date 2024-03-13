const jwt = require("jsonwebtoken");

const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(403)
        .json({ message: "Authentication token is required" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          message: "You do not have permission to perform this action",
        });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = verifyRole;
