const express = require("express");
const router = express.Router();

const serverController = require("../app/controllers/ServerControllers");
const middlewareController = require("../app/controllers/MiddlewareControllers");
const ChannelController = require("../app/controllers/ChannelController");

// Manage servers
router.get(
  "/",
  middlewareController.verifyToken,
  serverController.getUserServers
);
router.get(
  "/:id",
  middlewareController.verifyToken, middlewareController.ServerUserRelationship,
  serverController.getServerById
);
router.post(
  "/",
  middlewareController.verifyToken, middlewareController.ServerUserRelationship,
  serverController.createServer
);
router.put(
  "/:id",
  middlewareController.verifyToken, middlewareController.ServerUserRelationship,
  serverController.updateServer
);
router.delete(
  "/:id",
  middlewareController.verifyToken, middlewareController.checkServerOwner,
  serverController.deleteServer
);

// Manage channels
router.post(
  "/:serverId/create",
  middlewareController.verifyToken, middlewareController.checkServerOwner,
  ChannelController.createChannel
);
router.put(
  "/:serverId/:channelId",
  middlewareController.verifyToken, middlewareController.checkServerOwner,
  ChannelController.updateChannel
);
router.delete(
  "/:serverId/:channelId",
  middlewareController.verifyToken, middlewareController.checkServerOwner,
  ChannelController.deleteChannel
);


module.exports = router;
