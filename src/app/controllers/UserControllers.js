const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const FileUtils = require("../utils/fileUtils");

const tokenController = require("./TokenControllers");

class UserController {
  async testFunction(req, res) {
    res.send("welcome to user page");
  }

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;

      //Delete user
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error during user deletion:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "No refreshToken existed" });
      }
      tokenController.setRefreshToken(refreshToken, false, res);
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.log("Error during user logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { username, displayName, avatar } = req.body;

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Validate username if provided
      if (username !== undefined) {
        if (!username.trim() || username.trim().length < 6) {
          return res.status(400).json({
            message: "Username must be at least 6 characters long",
          });
        }

        if (username.trim().length > 20) {
          return res.status(400).json({
            message: "Username must be less than 20 characters",
          });
        }

        // Check if username is already taken (excluding current user)
        if (username.trim() !== user.username) {
          const existingUser = await User.findOne({
            username: username.trim(),
            _id: { $ne: userId },
          });

          if (existingUser) {
            return res.status(409).json({
              message: "Username is already taken",
            });
          }
        }

        user.username = username.trim();
      }

      // Validate and update display name
      if (displayName !== undefined) {
        if (displayName && displayName.trim().length > 32) {
          return res.status(400).json({
            message: "Display name must be less than 32 characters",
          });
        }
        user.displayName = displayName ? displayName.trim() : null;
      }

      // Update avatar
      if (avatar !== undefined) {
        if (
          user.avatar &&
          user.avatar !== "/uploads/user-avatars/default-avatar.png" &&
          user.avatar !== avatar
        ) {
          console.log("Cleaning up old avatar:", user.avatar);
          FileUtils.deleteUserAvatar(user.avatar);
        }
        user.avatar = avatar;
      }

      await user.save();

      // Generate new tokens with updated user data
      const updatedUserForToken = {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        displayName: user.displayName,
        role: user.role,
      };

      // Generate new access token with fresh data
      const newAccessToken =
        tokenController.generateAccessToken(updatedUserForToken);

      // Generate new refresh token with fresh data
      tokenController.generateRefreshToken(updatedUserForToken, res);

      // Return updated user data with new access token
      res.status(200).json({
        ...updatedUserForToken,
        accessToken: newAccessToken,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new UserController();
