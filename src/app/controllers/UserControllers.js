const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
}

module.exports = new UserController();
