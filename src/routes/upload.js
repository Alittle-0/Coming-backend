const express = require("express");
const router = express.Router();

const uploadController = require("../app/controllers/UploadController");
const middlewareController = require("../app/controllers/MiddlewareControllers");

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         avatarPath:
 *           type: string
 *         filename:
 *           type: string
 *         originalName:
 *           type: string
 *         size:
 *           type: number
 */

/**
 * @swagger
 * /upload/server-avatar:
 *   post:
 *     summary: Upload server avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               serverAvatar:
 *                 type: string
 *                 format: binary
 *                 description: Server avatar image file (max 5MB)
 *     responses:
 *       200:
 *         description: Server avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Bad request (invalid file, size too large, etc.)
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 */
router.post(
  "/server-avatar",
  middlewareController.verifyToken,
  uploadController.uploadServerAvatar
);

/**
 * @swagger
 * /upload/user-avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userAvatar:
 *                 type: string
 *                 format: binary
 *                 description: User avatar image file (max 2MB)
 *     responses:
 *       200:
 *         description: User avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 */
router.post(
  "/user-avatar",
  middlewareController.verifyToken,
  uploadController.uploadUserAvatar
);

/**
 * @swagger
 * /upload/server-avatar/{filename}:
 *   delete:
 *     summary: Delete server avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename of the avatar to delete
 *     responses:
 *       200:
 *         description: Avatar deleted successfully
 *       404:
 *         description: File not found
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/server-avatar/:filename",
  middlewareController.verifyToken,
  uploadController.deleteServerAvatar
);

router.delete(
  "/user-avatar/:filename",
  middlewareController.verifyToken,
  uploadController.deleteUserAvatar
);

/**
 * @swagger
 * /upload/cleanup-orphaned:
 *   delete:
 *     summary: Clean up orphaned files (admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cleanup completed
 */
router.delete(
  "/cleanup-orphaned",
  middlewareController.verifyAuthOrAdmin,
  uploadController.cleanupOrphanedFiles
);

module.exports = router;