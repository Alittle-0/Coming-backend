const bcrypt = require("bcrypt");
const User = require("../models/User");
const tokenController = require("./TokenControllers");
const TokenControllers = require("./TokenControllers");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class PageController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  mainPage(req, res) {
    res.send("Hello world!");
  }

  async createUser({username, password, email, avatar, displayName, type}) {
    if (!email) {
      return null;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return existingUser;

    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newUser = new User({
      username: username || email.split("@")[0],
      email,
      password: hashedPassword || null,
      avatar,
      displayName,
      type,
    });

    await newUser.save();
    const form = {
      message: "User registered successfull",
    };

    if (type) {
      return newUser;
    }
    return form;
  }

  async register(req, res) {
    try {
      const { username, password, email, type } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({
          message: "Username, password, and email are required",
        });
      }

      const result = await this.createUser({username, password, email});
      if (!result) {
        return res.status(403).json({message: "No email provided"});
      }
      if (!result.message) {
        return res.status(403).json({
          message: "User is already created before",
        });
      }
      res.status(200).json(result);
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
      };

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

  async googleLogin(req, res) {
    try {
      const { googleToken } = req.body;
      if (!googleToken) {
        return res.status(400).json({
          message: "No Google token provided",
        });
      }

      // Verify Google token
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      const result = await this.createUser({
        email: payload.email,
        avatar: payload.picture,
        displayName: payload.name,
        type: "google"
      });

      if (!result) {
        return res.status(403).json({message: "No email provided"});
      }
      if (result.message) {
        throw new Error("Logic error");
      }

      const safeData = {
        _id: result._id,
        username: result.username,
        email: result.email,
        avatar: result.avatar,
        role: result.role,
        displayName: result.displayName,
      };

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
      console.error("Error during login with google:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new PageController();
