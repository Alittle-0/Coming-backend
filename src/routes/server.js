const express = require("express");
const router = express.Router();

const serverController = require("../app/controllers/ServerControllers");
const middlewareController = require("../app/controllers/MiddlewareControllers");
const channelRouter = require("./channel");

/**
 * @swagger
 * /server:
 *   get:
 *     summary: Get user's servers
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's servers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   memberCount:
 *                     type: number
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  middlewareController.verifyToken,
  serverController.getUserServers
);

/**
 * @swagger
 * /server/{id}:
 *   get:
 *     summary: Get server by ID
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     responses:
 *       200:
 *         description: Server details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Server'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not a member of this server
 *       404:
 *         description: Server not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  middlewareController.verifyToken,
  middlewareController.ServerUserRelationship,
  serverController.getServerById
);

/**
 * @swagger
 * /server:
 *   post:
 *     summary: Create a new server
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "My Awesome Server"
 *               description:
 *                 type: string
 *                 maxLength: 1024
 *                 example: "A cool gaming server for friends"
 *     responses:
 *       201:
 *         description: Server created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Server'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       409:
 *         description: Server name already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  middlewareController.verifyToken,
  middlewareController.ServerUserRelationship,
  serverController.createServer
);

/**
 * @swagger
 * /server/{id}:
 *   put:
 *     summary: Update server
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 1024
 *     responses:
 *       200:
 *         description: Server updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Server'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Only server owner can update server
 *       404:
 *         description: Server not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  middlewareController.verifyToken,
  middlewareController.ServerUserRelationship,
  serverController.updateServer
);

/**
 * @swagger
 * /server/{id}:
 *   delete:
 *     summary: Delete server
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     responses:
 *       200:
 *         description: Server deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server deleted successfully"
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Only server owner can delete server
 *       404:
 *         description: Server not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  serverController.deleteServer
);

/**
 * @swagger
 * /server/{serverId}/members:
 *   post:
 *     summary: Add member to server
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of user to add
 *               nickname:
 *                 type: string
 *                 description: Optional nickname for the user
 *     responses:
 *       200:
 *         description: Member added successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Only server owner can add members
 *       404:
 *         description: Server or user not found
 *       409:
 *         description: User is already a member
 *       500:
 *         description: Internal server error
 */
router.post(
  "/:serverId/members",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  serverController.addMemberToServer
);

/**
 * @swagger
 * /server/{serverId}/members/{userId}:
 *   delete:
 *     summary: Remove member from server
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to remove
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Only server owner can remove members
 *       404:
 *         description: Server or user not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:serverId/members/:userId",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  serverController.removeMemberFromServer
);

/**
 * @swagger
 * /server/join/{inviteCode}:
 *   post:
 *     summary: Join server by invite code
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Server invite code
 *         example: "abc123def"
 *     responses:
 *       200:
 *         description: Successfully joined server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully joined server"
 *                 server:
 *                   $ref: '#/components/schemas/Server'
 *       400:
 *         description: Already a member or invalid invite code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are already a member of this server"
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Invalid or expired invite code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired invite code"
 *       500:
 *         description: Internal server error
 */
router.post(
  "/join/:inviteCode",
  middlewareController.verifyToken,
  serverController.joinServerByInvite
);

// Use channel router for channel-related routes
router.use("/:serverId/channels", channelRouter);

module.exports = router;
