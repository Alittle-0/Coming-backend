const express = require("express");
const router = express.Router({ mergeParams: true });

const middlewareController = require("../app/controllers/MiddlewareControllers");
const ChannelController = require("../app/controllers/ChannelController");

/**
 * @swagger
 * /server/{serverId}/channels:
 *   post:
 *     summary: Create a new channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *         example: "60f1b2a3c4d5e6f7a8b9c0d1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "general"
 *                 description: "Channel name (lowercase, no spaces)"
 *               type:
 *                 type: string
 *                 enum: [text, voice]
 *                 example: "text"
 *                 description: "Channel type"
 *               description:
 *                 type: string
 *                 maxLength: 1024
 *                 example: "General discussion channel"
 *                 description: "Optional channel description"
 *     responses:
 *       201:
 *         description: Channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Channel created successfully"
 *                 channel:
 *                   $ref: '#/components/schemas/Channel'
 *       400:
 *         description: Invalid input data or channel name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Channel name already exists in this server"
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Only server owner can create channels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Only server owner can create channels"
 *       404:
 *         description: Server not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server not found"
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  ChannelController.createChannel
);

/**
 * @swagger
 * /server/{serverId}/channels/{channelId}:
 *   put:
 *     summary: Update a channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *         example: "60f1b2a3c4d5e6f7a8b9c0d1"
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel ID
 *         example: "60f1b2a3c4d5e6f7a8b9c0d2"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "updated-general"
 *               type:
 *                 type: string
 *                 enum: [text, voice]
 *                 example: "text"
 *               description:
 *                 type: string
 *                 maxLength: 1024
 *                 example: "Updated channel description"
 *     responses:
 *       200:
 *         description: Channel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Channel updated successfully"
 *                 channel:
 *                   $ref: '#/components/schemas/Channel'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Only server owner can update channels
 *       404:
 *         description: Channel or server not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:channelId",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  ChannelController.updateChannel
);

/**
 * @swagger
 * /server/{serverId}/channels/{channelId}:
 *   delete:
 *     summary: Delete a channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *         example: "60f1b2a3c4d5e6f7a8b9c0d1"
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel ID
 *         example: "60f1b2a3c4d5e6f7a8b9c0d2"
 *     responses:
 *       200:
 *         description: Channel deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Channel deleted successfully"
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Only server owner can delete channels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Only server owner can delete channels"
 *       404:
 *         description: Channel or server not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Channel not found"
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:channelId",
  middlewareController.verifyToken,
  middlewareController.checkServerOwner,
  ChannelController.deleteChannel
);

module.exports = router;
