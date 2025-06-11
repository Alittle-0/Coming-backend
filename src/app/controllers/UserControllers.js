const bcrypt = require("bcrypt");
const User = require("../../app/models/user");
const jwt = require("jsonwebtoken");

class UserController {
  async testFunction(req, res) {
    res.send("welcome to user page");
  }

  async register(req, res) {
    try {
      const { username, password, email } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //Create a new user instance
      const newUser = await new User({
        username: username,
        email: req.body.email,
        password: hashedPassword,
      });

      //Save user to database
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      //Find user
      const user = await User.findOne({
        $or: [{ username: username }, { email: username }],
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      //Validate password
      const isPassValid = await bcrypt.compare(password, user.password);
      if (!isPassValid) {
        return res.status(404).json({ message: "Invalid password" });
      }

      //Return user data if successful
      const accessToken = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: "1d" }
      );
      const { password: userPassword, role: userRole, ...other } = user._doc;
      res.status(200).json({
        ...other,
        accessToken: accessToken,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
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
