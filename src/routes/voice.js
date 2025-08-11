const express = require('express');
const router = express.Router();
const voiceController = require('../app/controllers/VoiceController');
const middlewareController = require('../app/controllers/MiddlewareControllers');

// Get voice token for joining a voice channel
router.post('/token/:channelId', middlewareController.verifyToken, voiceController.getVoiceToken);

// Get room information
router.get('/room/:channelId', middlewareController.verifyToken, voiceController.getRoomInfo);

module.exports = router;
