const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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



}

module.exports = new UserController();
