const {
  ref,
  set,
  get,
  push,
  orderByChild,
  limitToLast,
  query,
} = require("firebase/database");

class MessageController {
  async sendMessage(req, res) {
    try {
      const firebaseDB = req.app.locals.firebaseDB;
      const { channelId } = req.params;
      const { message } = req.body;
      const userId = req.user.id;
      const username = req.user.username;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Create a reference to the messages for this channel
      const messagesRef = ref(firebaseDB, `channels/${channelId}/messages`);

      // Push a new message
      const newMessageRef = push(messagesRef);
      const messageData = {
        message: message.trim(),
        userId: userId,
        username: username,
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
      };

      await set(newMessageRef, messageData);

      res.status(200).json({
        success: true,
        messageId: newMessageRef.key,
        message: messageData,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  }

  async getMessages(req, res) {
    try {
      const firebaseDB = req.app.locals.firebaseDB;
      const { channelId } = req.params;
      const limit = parseInt(req.query.limit) || 50;

      const messagesRef = ref(firebaseDB, `channels/${channelId}/messages`);
      const messagesQuery = query(
        messagesRef,
        orderByChild("timestamp"),
        limitToLast(limit)
      );

      const snapshot = await get(messagesQuery);

      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        // Convert to array and sort by timestamp
        const messages = Object.keys(messagesData)
          .map((key) => ({
            id: key,
            ...messagesData[key],
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        res.status(200).json(messages);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  }
}

module.exports = new MessageController();
