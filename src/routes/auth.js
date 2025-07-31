const express = require("express");
const router = express.Router();

const userController = require("../app/controllers/UserControllers");
const adminController = require("../app/controllers/AdminControllers");
const TokenController = require("../app/controllers/TokenControllers");
const middlewareController = require("../app/controllers/MiddlewareControllers");

/* GET users listing. */
router.get("/",  middlewareController.verifyToken, userController.testFunction);

//[delete] /user/{:id}
router.delete("/:id", middlewareController.verifyAuthOrAdmin, userController.deleteUser);

//[POST] /user/logout
router.post("/logout", middlewareController.verifyToken, userController.logout);


//---------------Token management routes--------------//
//[POST] /user/requestRefreshToken
router.post("/requestRefreshToken", TokenController.requestRefreshToken)

//---------------User management routes--------------//

//[GET] /admin/getAllUsers
router.get("/getAllUsers", middlewareController.verifyAuthOrAdmin, adminController.getAllUsers);

//[DELETE] /admin/deleteAllUsers
router.delete(
  "/delete",
  middlewareController.verifyAuthOrAdmin,
  adminController.deleteAllUsers
);

module.exports = router;
