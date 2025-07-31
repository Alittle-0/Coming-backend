const express = require("express");
const router = express.Router({ mergeParams: true });

const middlewareController = require("../app/controllers/MiddlewareControllers");
const ChannelController = require("../app/controllers/ChannelController");

// All routes here are prefixed with /server/:serverId/channels

// [POST] /server/:serverId/channels - Create a new channel
router.post(
  "/",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  ChannelController.createChannel
);

// [PUT] /server/:serverId/channels/:channelId - Update a channel
router.put(
  "/:channelId",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  ChannelController.updateChannel
);

// [DELETE] /server/:serverId/channels/:channelId - Delete a channel
router.delete(
  "/:channelId",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  ChannelController.deleteChannel
);

module.exports = router;
