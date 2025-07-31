const express = require("express");
const router = express.Router();

const serverController = require("../app/controllers/ServerControllers");
const middlewareController = require("../app/controllers/MiddlewareControllers");
const channelRouter = require("./channel");

// Manage servers
router.get(
  "/",
  middlewareController.verifyToken,
  serverController.getUserServers
);
router.get(
  "/:id",
  middlewareController.verifyToken,
  middlewareController.ServerUserRelationship,
  serverController.getServerById
);
router.post(
  "/",
  middlewareController.verifyToken,
  middlewareController.ServerUserRelationship,
  serverController.createServer
);
router.put(
  "/:id",
  middlewareController.verifyToken,
  middlewareController.ServerUserRelationship,
  serverController.updateServer
);
router.delete(
  "/:id",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  serverController.deleteServer
);

// Manage server members
router.post(
  "/:serverId/members",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  serverController.addMemberToServer
);
router.delete(
  "/:serverId/members/:userId",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  serverController.removeMemberFromServer
);
router.post(
  "/join/:inviteCode",
  middlewareController.verifyToken,
  serverController.joinServerByInvite
);

// Use channel router for channel-related routes
router.use("/:serverId/channels", channelRouter);

module.exports = router;
