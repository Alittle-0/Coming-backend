const express = require("express");
const router = express.Router();

const userController = require("../../app/controllers/UserControllers");
const adminController = require("../../app/controllers/AdminControllers");
const middlewareController = require("../../app/controllers/MiddlewareControllers");

/* GET users listing. */
router.get("/", userController.testFunction);

//[POST] /user/register
router.post("/register", userController.register);

//[POST] /user/register
router.post("/login", middlewareController.verifyToken, userController.login);

//[delete] /user/{:id}
router.delete("/:id", middlewareController.verifyToken, userController.deleteUser);

//---------------User management routes--------------//

//[GET] /admin/getAllUsers
router.get("/", middlewareController.verifyToken, adminController.getAllUsers);

//[DELETE] /admin/deleteAllUsers
router.delete(
  "/delete",
  middlewareController.verifyToken,
  adminController.deleteAllUsers
);

module.exports = router;
