const jwt = require("jsonwebtoken");

class MiddlewareControllers {
  async verifyToken(req, res, next) {
    const token = req.headers.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (error, user) => {
        if (error) {
          return res.status(403).json({ message: "Invalid token." });
        }
      });
      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ message: "Invalid token." });
    }
  }
}

module.exports = new MiddlewareControllers();
