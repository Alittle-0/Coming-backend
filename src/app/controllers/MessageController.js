const Message = require("../models/Message");

const messageController = {
  // Save a new message
  saveMessage: async (messageData) => {
    try {
      const message = new Message({
        channelId: messageData.channelId,
        message: messageData.message,
        user: messageData.user,
        timestamp: messageData.timestamp || new Date(),
      });

      const savedMessage = await message.save();
      return savedMessage;
    } catch (error) {
      console.error("Error saving message:", error);
      throw error;
    }
  },

  // Get messages for a channel
  getChannelMessages: async (req, res) => {
    try {
      const { channelId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const messages = await Message.find({ channelId })
        .sort({ timestamp: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      // Reverse to show oldest first
      const reversedMessages = messages.reverse();

      res.status(200).json({
        success: true,
        data: reversedMessages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: await Message.countDocuments({ channelId }),
        },
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching messages",
        error: error.message,
      });
    }
  },

  // Delete a message
  deleteMessage: async ({ messageId, user }) => {
    try {
      const userId = user.id;
      console.log(user.id);

      const message = await Message.findById(messageId);

      if (!message) {
        return { status: 404, success: false, message: "Message not found" };
      }

      // Check if user owns the message
      if (message.user.id !== userId) {
        return {
          status: 403,
          success: false,
          message: "Not authorized to delete this message",
        };
      }

      await Message.findByIdAndDelete(messageId);

      return { status: 200, success: true, message: "Message deleted successfully" };
    } catch (error) {
      console.error("Error deleting message:", error);
      return { status: 500, success: false, message: "Error deleting message", error: error.message };
    }
  },

  // Edit a message
  editMessage: async ({ messageId, newMessage, user }) => {
    try {
      const userId = user.id;

      // Validate input
      if (!userId) {
        return { status: 400, success: false, message: "User ID is required" };
      }

      if (!newMessage || newMessage.trim() === "") {
        return { status: 400, success: false, message: "Message content is required" };
      }

      const message = await Message.findById(messageId);

      if (!message) {
        return { status: 404, success: false, message: "Message not found" };
      }

      // Check if user owns the message
      if (message.user.id !== userId) {
        return { status: 403, success: false, message: "Not authorized to edit this message" };
      }

      // Update the message
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        {
          message: newMessage.trim(),
          isEdited: true,
          editedAt: new Date(),
        },
        { new: true }
      );

      return { status: 200, success: true, message: "Message updated successfully", updatedMessage };
    } catch (error) {
      console.error("Error editing message:", error);
      return { status: 500, success: false, message: "Error editing message", error: error.message };
    }
  },
};

module.exports = messageController;
