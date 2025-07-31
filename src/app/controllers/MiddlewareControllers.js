const jwt = require("jsonwebtoken");
const Server = require("../models/Server");

class MiddlewareController {
  constructor() {
    this.verifyToken = this.verifyToken.bind(this);
    this.verifyAuthOrAdmin = this.verifyAuthOrAdmin.bind(this);
    this.checkServerExists = this.ServerUserRelationship.bind(this);
    this.checkServerOwner = this.checkServerOwner.bind(this);
  }

  // Middleware to verify if the user is authenticated
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

  // Middleware to check server existence, server owner, server member
  async ServerUserRelationship(req, res, next) {
    try {
      const { serverId, id } = req.params;
      const userId = req.user.id;
      const serverIdToCheck = serverId || id;

      if (!serverIdToCheck) {
        return res.status(400).json({ message: "Server ID is required" });
      }

      const server = await Server.findById(serverIdToCheck);
      if (!server) {
        return res.status(404).json({ message: "Server not found" });
      }

      const isMember = server.isMember(userId);

      if (!isMember) {
        return res
          .status(403)
          .json({ message: "You are not a member of this server" });
      }

      // Attach server to request for next middleware/controller
      req.server = server;
      next();
    } catch (error) {
      console.error("Server check error:", error);
      res.status(500).json({ message: "Error checking server" });
    }
  }

  async checkServerOwner(req, res, next) {
    this.ServerUserRelationship(req, res, async () => {
      try {
        const userId = req.user.id;
        const server = req.server;

        if (!server) {
          return res
            .status(400)
            .json({ message: "Server not found in request" });
        }

        if (!server.isOwner(userId)) {
          return res
            .status(403)
            .json({ message: "Only server owner can perform this action" });
        }
        next();
      } catch (error) {
        console.error("Server owner check error:", error);
        res.status(500).json({ message: "Error checking server ownership" });
      }
    });
  }
}

module.exports = new MiddlewareController();
