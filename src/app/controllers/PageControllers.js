const bcrypt = require("bcrypt");
const User = require("../models/User");
const tokenController = require("./TokenControllers");

class PageController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  mainPage(req, res) {
    res.send("Hello world!");
  }

  async register(req, res) {
    try {
      const { username, password, email } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //Create a new user instance
      const newUser = await new User({
        username: username,
        email: email,
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
      const accessToken = tokenController.generateAccessToken(user);
      tokenController.generateRefreshToken(user, res);
      const { password: userPassword, role: userRole, ...other } = user._doc;
      res.status(200).json({
        ...other,
        accessToken: accessToken,
        message: "Suscessfully",
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new PageController();
