const jwt = require("jsonwebtoken");

const refreshTokens = new Set();
class TokenController {
  constructor() {
    this.generateAccessToken = this.generateAccessToken.bind(this);
    this.generateRefreshToken = this.generateRefreshToken.bind(this);
    this.requestRefreshToken = this.requestRefreshToken.bind(this);
    this.setRefreshToken = this.setRefreshToken.bind(this);
  }

  setRefreshToken(refreshToken, check, res) {
    check
      ? (res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, // Set to true if using HTTPS
          sameSite: "strict",
        }),
        refreshTokens.add(refreshToken))
      : (res.clearCookie("refreshToken"), refreshTokens.delete(refreshToken));
  }

  generateAccessToken(user) {

    return jwt.sign(
      {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "1d" }
    );
  }

  generateRefreshToken(user, res) {
    const refreshToken = jwt.sign(
      {
        id: user._id|| user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "30d" }
    );
    this.setRefreshToken(refreshToken, true, res);
  }

  async requestRefreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "You are not authenticated" });
      }
      if (!refreshTokens.has(refreshToken)) {
        return res.status(403).json({ message: "Refresh token is not valid" });
      }

      // Verify the refresh token
      jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (error, user) => {
        if (error) {
          console.log(error);
          this.setRefreshToken(refreshToken, false, res);
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Remove the old refresh token
        this.setRefreshToken(refreshToken, false, res);

        // Generate new access token
        const newAccessToken = this.generateAccessToken(user);
        this.generateRefreshToken(user, res);
        res.status(200).json({ accessToken: newAccessToken });
      });
    } catch (error) {
      console.error("Error during refresh token request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new TokenController();
