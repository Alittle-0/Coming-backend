const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const db = require("./src/config/db/connect");
const { database: firebaseDB } = require("./src/config/db/firestore");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

//Configure environment variables
db();
app.locals.firebaseDB = firebaseDB;
dotenv.config();

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://app-react-drab.vercel.app",
      "http://localhost:3000",
      "https://coming-server.vercel.app",
      "https://coming-tau.vercel.app/",
    ], // Your React app URL
    credentials: true,
  })
);

//Route
const Routes = require("./src/routes/navigator");
Routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  const statusCode = err.status || 500;
  const errorResponse = {
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  };

  // send json error response
  res.status(statusCode).json(errorResponse);
});

module.exports = app;
