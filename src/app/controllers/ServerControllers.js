const Server = require("../models/Server");
const User = require("../models/User");
const Channel = require("../models/Channel");

class ServerController {
  // [GET] /server/  /* get all server which user is member */
  async getUserServers(req, res) {
    try {
      const userId = req.user.id;

      const servers = await Server.find({
        $or: [{ ownerId: userId }, { "members.userId": userId }],
      })
        .select("_id name")
        .lean();
        
      res.status(200).json(servers);
    } catch (error) {
      console.error("Error fetching user servers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // [GET] /server/:id /* get server by id */
  async getServerById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const server = await Server.findById(id).populate("channels");

      res.status(200).json(server);
    } catch (error) {
      console.error("Error fetching server:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // [POST] /server/ /* create new server which user is the owner */
  async createServer(req, res) {
    try {
      const { name, description } = req.body;
      const userId = req.user.id;

      // Validation
      if (!name || name.trim().length < 3) {
        return res
          .status(400)
          .json({ message: "Server name  must be at least 3 characters long" });
      }

      if (name.length > 100) {
        return res
          .status(400)
          .json({ message: "Server name must be less than 100 characters" });
      }

      // Create server
      const newServer = new Server({
        name: name.trim(),
        description: description || "",
        ownerId: userId,
        members: [
          {
            userId: userId,
            joinedAt: new Date(),
          },
        ],
        inviteCode: null,
        isActive: true,
      });

      const savedServer = await newServer.save();

      // Generate invite code with server._id
      const inviteCode = `${savedServer._id.toString().slice(-6)}${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      // Update server with invite code
      savedServer.inviteCode = inviteCode;

      // Create default channels
      const defaultChannels = [
        {
          name: "general",
          type: "text",
          serverId: savedServer._id,
          description: "General discussion channel",
          isActive: true,
        },
        {
          name: "General Voice",
          type: "voice",
          serverId: savedServer._id,
          description: "General voice channel",
          isActive: true,
        },
      ];

      // Create channels and get their IDs
      const createdChannels = await Channel.insertMany(defaultChannels);
      const channelIds = createdChannels.map((channel) => channel._id);

      // Add channels to server
      savedServer.channels = channelIds;
      await savedServer.save();

      // Add server to user's servers array
      await User.findByIdAndUpdate(userId, {
        $addToSet: { servers: savedServer._id },
      });

      // Populate the response
      const populatedServer = await Server.findById(savedServer._id)
        .populate("ownerId", "username displayName avatar")
        .populate("members.userId", "username displayName avatar");

      res.status(201).json(populatedServer);
    } catch (error) {
      console.error("Error creating server:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // [PUT] /server/:id /* update server (owner only) */
  async updateServer(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const userId = req.user.id;

      const server = await Server.findById(id);

      if (!server) {
        return res.status(404).json({
          message: "Server not found",
        });
      }

      // Check if user is owner
      if (!server.isOwner(userId)) {
        return res.status(403).json({
          message: "Only server owner can update server settings",
        });
      }

      // Update fields
      if (name) server.name = name.trim();
      if (description !== undefined) server.description = description;

      await server.save();

      res.status(200).json({
        message: "Server updated successfully",
      });
    } catch (error) {
      console.error("Error updating server:", error);
      res.status(500).json({
        message: "Error updating server",
      });
    }
  }

  // [DELETE] /server/:id /* delete server (owner only) */
  async deleteServer(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const server = await Server.findById(id);

      if (!server) {
        return res.status(404).json({
          message: "Server not found",
        });
      }

      // Check if user is owner
      if (!server.isOwner(userId)) {
        return res.status(403).json({
          message: "Only server owner can delete the server",
        });
      }

      // Remove server from all members' servers array
      await User.updateMany({ servers: id }, { $pull: { servers: id } });

      await Server.findByIdAndDelete(id);

      res.status(200).json({
        message: "Server deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting server:", error);
      res.status(500).json({
        message: "Error deleting server",
      });
    }
  }

  // [POST] /server/:serverId/members /* add member to server (owner only) */
  async addMemberToServer(req, res) {
    try {
      const { serverId } = req.params;
      const { userId, nickname } = req.body;
      const requestingUserId = req.user.id;

      // Validation
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Check if user exists
      const userToAdd = await User.findById(userId);
      if (!userToAdd) {
        return res.status(404).json({ message: "User not found" });
      }

      const server = await Server.findById(serverId);
      if (!server) {
        return res.status(404).json({ message: "Server not found" });
      }

      // Check if user is already a member
      if (server.isMember(userId)) {
        return res.status(400).json({ message: "User is already a member of this server" });
      }

      // Add user to server members
      server.members.push({
        userId: userId,
        joinedAt: new Date(),
        nickname: nickname || null
      });

      // Add server to user's servers array
      userToAdd.servers.push(serverId);

      // Save both documents
      await Promise.all([
        server.save(),
        userToAdd.save()
      ]);

      res.status(200).json({ 
        message: "Member added successfully",
        member: {
          userId: userId,
          username: userToAdd.username,
          nickname: nickname || null,
          joinedAt: new Date()
        }
      });
    } catch (error) {
      console.error("Error adding member to server:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // [DELETE] /server/:serverId/members/:userId /* remove member from server (owner only) */
  async removeMemberFromServer(req, res) {
    try {
      const { serverId, userId } = req.params;
      const requestingUserId = req.user.id;

      const server = await Server.findById(serverId);
      if (!server) {
        return res.status(404).json({ message: "Server not found" });
      }

      // Prevent owner from removing themselves
      if (server.isOwner(userId)) {
        return res.status(400).json({ message: "Server owner cannot be removed. Transfer ownership first." });
      }

      // Check if user is a member
      if (!server.isMember(userId)) {
        return res.status(400).json({ message: "User is not a member of this server" });
      }

      // Remove user from server members
      server.members = server.members.filter(member => 
        member.userId.toString() !== userId.toString()
      );

      // Remove server from user's servers array
      await User.findByIdAndUpdate(userId, {
        $pull: { servers: serverId }
      });

      await server.save();

      res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
      console.error("Error removing member from server:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // [POST] /server/join/:inviteCode /* join server using invite code */
  async joinServerByInvite(req, res) {
    try {
      const { inviteCode } = req.params;
      const userId = req.user.id;

      if (!inviteCode) {
        return res.status(400).json({ message: "Invite code is required" });
      }

      // Find server by invite code
      const server = await Server.findOne({ inviteCode: inviteCode, isActive: true });
      if (!server) {
        return res.status(404).json({ message: "Invalid or expired invite code" });
      }

      // Check if user is already a member
      if (server.isMember(userId)) {
        return res.status(400).json({ message: "You are already a member of this server" });
      }

      // Add user to server members
      server.members.push({
        userId: userId,
        joinedAt: new Date(),
      });

      // Add server to user's servers array
      await User.findByIdAndUpdate(userId, {
        $addToSet: { servers: server._id }
      });

      await server.save();

      // Return server info with populated channels
      const populatedServer = await Server.findById(server._id)
        .populate("channels")
        .lean();

      res.status(200).json({ 
        message: "Successfully joined server",
        server: populatedServer
      });
    } catch (error) {
      console.error("Error joining server:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

}

module.exports = new ServerController();
