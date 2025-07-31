const express = require("express");
const router = express.Router();

const MessageController = require("../app/controllers/MessageController");
const middlewareController = require("../app/controllers/MiddlewareControllers");

// Send message to channel
router.post(
  "/:channelId",
  middlewareController.verifyToken,
  MessageController.sendMessage
);

// Get messages from channel
router.get(
  "/:channelId",
  middlewareController.verifyToken,
  MessageController.getMessages
);

module.exports = router;
