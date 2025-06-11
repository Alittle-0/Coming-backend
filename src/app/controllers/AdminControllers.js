const User = require("../models/User");

class AdminController {
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      users ? res.status(200).json(users) :
        res.status(404).json({ message: "No users found" });
    }
    catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteAllUsers(req, res) {
    try {
      const deletedUser = await User.deleteMany();
      if (!deletedUser) {
        return res.status(404).json({ message: "No user exsist" });
      }
      res.status(200).json({ message: "All users deleted successfully" });
    }
    catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new AdminController();
