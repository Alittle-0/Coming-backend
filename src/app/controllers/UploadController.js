const path = require('path');
const fs = require('fs');
const multerConfig = require('../../config/multer');

class UploadController {
  constructor() {
    this.serverAvatarUpload = multerConfig.getServerAvatarUpload();
    this.userAvatarUpload = multerConfig.getUserAvatarUpload();
  }

  // Upload server avatar
  uploadServerAvatar = (req, res) => {
    this.serverAvatarUpload(req, res, (err) => {
      if (err) {
        return this.handleUploadError(err, res);
      }

      if (!req.file) {
        return res.status(400).json({ 
          message: 'No file uploaded' 
        });
      }
      const avatarPath = `/uploads/server-avatars/${req.file.filename}`;
      
      res.status(200).json({
        message: 'Server avatar uploaded successfully',
        avatarPath: avatarPath,
      });
    });
  }

  // Upload user avatar (for future use)
  uploadUserAvatar = (req, res) => {
    this.userAvatarUpload(req, res, (err) => {
      if (err) {
        return this.handleUploadError(err, res);
      }

      if (!req.file) {
        return res.status(400).json({ 
          message: 'No file uploaded' 
        });
      }

      const avatarPath = `/uploads/user-avatars/${req.file.filename}`;
      
      res.status(200).json({
        message: 'User avatar uploaded successfully',
        avatarPath: avatarPath,
      });
    });
  }

  // Generic error handler for uploads
  handleUploadError(err, res) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large. Please check the size limit.' 
      });
    }
    
    return res.status(400).json({ 
      message: err.message || 'Upload error occurred'
    });
  }

  // Delete server avatar
  deleteServerAvatar = (req, res) => {
    this.deleteFile(req, res, 'server-avatars', 'Server avatar');
  }

  // Delete user avatar (for future use)
  deleteUserAvatar = (req, res) => {
    this.deleteFile(req, res, 'user-avatars', 'User avatar');
  }

  // Delete channel icon (for future use)
  deleteChannelIcon = (req, res) => {
    this.deleteFile(req, res, 'channel-icons', 'Channel icon');
  }

  // Generic file deletion method
  deleteFile(req, res, folder, fileType) {
    try {
      const { filename } = req.params;
      const uploadsDir = path.join(__dirname, '../../../public/uploads', folder);
      const filePath = path.join(uploadsDir, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.status(200).json({ 
          message: `${fileType} deleted successfully` 
        });
      } else {
        res.status(404).json({ 
          message: 'File not found' 
        });
      }
    } catch (error) {
      console.error(`Delete ${fileType.toLowerCase()} error:`, error);
      res.status(500).json({ 
        message: `Internal server error during ${fileType.toLowerCase()} deletion` 
      });
    }
  }

  cleanupOrphanedFiles = async (req, res) => {
  try {
    // This would find files that exist on disk but not in database
    // Implementation depends on your specific needs
    res.status(200).json({
      message: "Cleanup completed successfully"
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({
      message: "Error during cleanup"
    });
  }
}

}

module.exports = new UploadController();