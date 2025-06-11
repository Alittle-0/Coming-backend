const express = require("express");
const router = express.Router();

const pageController = require("../../app/controllers/PageControllers");
const middlewareController = require("../../app/controllers/MiddlewareControllers");

// GET main page
router.get("/", pageController.mainPage);

module.exports = router;
