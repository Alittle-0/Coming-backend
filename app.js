const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const db = require("./src/config/db/connect");
const cors = require("cors");
const dotenv = require("dotenv");
const { swaggerUi, specs } = require("./src/config/swagger");

const app = express();

//Configure environment variables
dotenv.config();
db();

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
      "https://coming-tau.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Coming API Documentation",
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

  // Log error for debugging
  console.error("Error occurred:", {
    status: statusCode,
    message: err.message,
    stack: err.stack,
  });

  // send json error response
  res.status(statusCode).json(errorResponse);
});

module.exports = app;
