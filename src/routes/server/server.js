const express = require("express");
const router = express.Router();

const serverController = require("../../app/controllers/ServerControllers");
const middlewareController = require("../../app/controllers/MiddlewareControllers");

// Apply middleware to all routes that need authentication
router.get(
  "/",
  middlewareController.verifyToken,
  serverController.getUserServers
);
router.post(
  "/",
  middlewareController.verifyToken,
  serverController.createServer
);
router.put(
  "/:id",
  middlewareController.verifyToken,
  serverController.updateServer
);
router.delete(
  "/:id",
  middlewareController.verifyToken,
  serverController.deleteServer
);

module.exports = router;
