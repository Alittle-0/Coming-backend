const Server = require("../models/Server");
const Channel = require("../models/Channel");

class ChannelController {
  async createChannel(req, res) {
    try {
      const { name, type, description } = req.body;
      const server = req.server;

      // Validation
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ message: "Channel name is required" });
      }

      if (!type || !["text", "voice"].includes(type)) {
        return res
          .status(400)
          .json({ message: "Valid channel type is required (text or voice)" });
      }

      // Check if channel name already exists in this server
      const existingChannel = await Channel.findOne({
        serverId: server._id,
        name: name.trim(),
      });

      if (existingChannel) {
        return res
          .status(400)
          .json({ message: "Channel name already exists in this server" });
      }

      const channel = new Channel({
        name: name.trim(),
        type: type,
        description: description || "",
        serverId: server._id,
        isActive: true,
      });

      const savedChannel = await channel.save();

      // Add channel to server's channels array
      server.channels.push(savedChannel._id);
      await server.save();

      res.status(201).json(savedChannel);
    } catch (error) {
      console.error("Error creating channel:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateChannel(req, res) {
    try {
      const { channelId } = req.params;
      const { name, type, description } = req.body;
      const server = req.server;

      // Update fields
      const updatedData = {};
      if (name !== undefined) updatedData.name = name.trim();
      if (type !== undefined) updatedData.type = type;
      if (description !== undefined) updatedData.description = description;
      updatedData.updatedAt = new Date();

      const channel = await Channel.findOneAndUpdate(
        { _id: channelId, serverId: server._id },
        updatedData,
        { new: true }
      );

      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }

      res.status(200).json(channel);
    } catch (error) {
      console.error("Error updating channel:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteChannel(req, res) {
    try {
      const { channelId } = req.params;
      const server = req.server;

      const channel = await Channel.findOneAndDelete({
        _id: channelId,
        serverId: server._id,
      });

      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }

      // Remove channel from server's channels array
      server.channels.pull(channelId);
      await server.save();

      res.status(200).json({ message: "Channel deleted successfully" });
    } catch (error) {
      console.error("Error deleting channel:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new ChannelController();
