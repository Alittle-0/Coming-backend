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

      if (!username || !password || !email) {
        return res.status(400).json({ 
          message: "Username, password, and email are required" 
        });
      }
      
      const existingUser = await User.findOne({
        $or: [{ username: username }, { email: email }]
      });

      if (existingUser) {
        return res.status(409).json({ 
          message: "Username or email already exists" 
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //Create a new user instance
      const newUser = await new User({
        username: username,
        email: email,
        password: hashedPassword,
      });

      //Save user to database
      await newUser.save();
      const message = "User registered successfully";

      res.status(200).json(message);
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

      const safeData = {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        displayName: user.displayName,
      }

      //Generate access and refresh tokens
      const accessToken = tokenController.generateAccessToken(safeData);
      tokenController.generateRefreshToken(safeData, res);
      
      //Return user data if successful
      res.status(200).json({
        user: safeData,
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
