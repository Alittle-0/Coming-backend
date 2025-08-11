const { AccessToken } = require('livekit-server-sdk');

class VoiceController {
  async getVoiceToken(req, res) {
    try {
      const { channelId } = req.params;
      const { userId, username } = req.body;
      
      if (!channelId || !userId) {
        return res.status(400).json({ 
          error: 'channelId and userId are required' 
        });
      }

      const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
          identity: userId,
          name: username || userId,
        }
      );

      at.addGrant({
        roomJoin: true,
        room: `voice-${channelId}`,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      const token = await at.toJwt();

      res.json({
        token,
        room: `voice-${channelId}`,
        url: process.env.LIVEKIT_URL
      });

    } catch (error) {
      console.error('Error generating voice token:', error);
      res.status(500).json({ error: 'Failed to generate voice token' });
    }
  }

  async getRoomInfo(req, res) {
    try {
      const { channelId } = req.params;
      res.json({
        room: `voice-${channelId}`,
        participants: [],
        isActive: true
      });

    } catch (error) {
      console.error('Error getting room info:', error);
      res.status(500).json({ error: 'Failed to get room info' });
    }
  }
}

module.exports = new VoiceController();
