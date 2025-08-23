const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const db = require("./src/config/db/connect");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
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

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const allowedOrigins = process.env.ORIGIN ? process.env.ORIGIN.split(",") : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
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
