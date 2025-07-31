const express = require("express");
const router = express.Router();
const messageController = require("../app/controllers/MessageController");

// Get messages for a specific channel
router.get("/channel/:channelId", messageController.getChannelMessages);

// Delete a message
router.delete("/:messageId", messageController.deleteMessage);

module.exports = router;
