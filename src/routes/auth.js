const express = require("express");
const router = express.Router();

const userController = require("../app/controllers/UserControllers");
const adminController = require("../app/controllers/AdminControllers");
const TokenController = require("../app/controllers/TokenControllers");
const middlewareController = require("../app/controllers/MiddlewareControllers");

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Test function for authenticated users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Test function works"
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 */
router.get("/", middlewareController.verifyToken, userController.testFunction);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       403:
 *         description: Not authorized to delete this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  middlewareController.verifyAuthOrAdmin,
  userController.deleteUser
);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
 *       401:
 *         description: No refresh token found
 *       500:
 *         description: Internal server error
 */
router.post("/logout", middlewareController.verifyToken, userController.logout);

/**
 * @swagger
 * /user/requestRefreshToken:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Not authenticated or no refresh token
 *       403:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
router.post("/requestRefreshToken", TokenController.requestRefreshToken);

/**
 * @swagger
 * /admin/getAllUsers:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin access required
 *       404:
 *         description: No users found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/getAllUsers",
  middlewareController.verifyAuthOrAdmin,
  adminController.getAllUsers
);

/**
 * @swagger
 * /admin/delete:
 *   delete:
 *     summary: Delete all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All users deleted successfully"
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin access required
 *       404:
 *         description: No users exist
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/delete",
  middlewareController.verifyAuthOrAdmin,
  adminController.deleteAllUsers
);

module.exports = router;
