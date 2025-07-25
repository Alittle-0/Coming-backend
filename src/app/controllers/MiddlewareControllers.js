const jwt = require("jsonwebtoken");

class MiddlewareController {

  constructor() {
    this.verifyToken = this.verifyToken.bind(this);
    this.verifyAuthOrAdmin = this.verifyAuthOrAdmin.bind(this);
  }

  async verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      const accessToken = token.split(" ")[1];
      // Store decoded user data from JWT verification
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      if (error.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Invalid token." });
      }
      res.status(401).json({ message: "You are not authenticated." });
    }
  }

  async verifyAuthOrAdmin(req, res, next) {
    this.verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.role === "admin") {
        next();
      } else {
        res.status(403).json({ message: "You are not allowed to do that!" });
      }
    });
  }
}

module.exports = new MiddlewareController();
