const fs = require('fs');
const path = require('path');

class FileUtils {
  /**
   * Delete a file from the uploads directory
   * @param {string} filePath - The relative path of the file (e.g., "/uploads/server-avatars/filename.jpg")
   * @param {string} baseDir - Base directory (defaults to uploads)
   */
  static deleteUploadedFile(filePath, baseDir = 'uploads') {
    try {
      if (!filePath) return false;

      // Extract filename from the path
      const filename = path.basename(filePath);
      
      // Determine the folder from the path
      const pathParts = filePath.split('/');
      const folder = pathParts[pathParts.length - 2]; // e.g., "server-avatars"
      
      // Construct the full path
      const fullPath = path.join(__dirname, '../../../public', baseDir, folder, filename);
      
      // Check if file exists and delete it
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted file: ${filePath}`);
        return true;
      } else {
        console.log(`File not found: ${fullPath}`);
        return false;
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Delete server avatar
   * @param {string} avatarPath - The avatar path from database
   */
  static deleteServerAvatar(avatarPath) {
    return this.deleteUploadedFile(avatarPath);
  }

  /**
   * Delete user avatar
   * @param {string} avatarPath - The avatar path from database
   */
  static deleteUserAvatar(avatarPath) {
    return this.deleteUploadedFile(avatarPath);
  }

  /**
   * Delete channel icon
   * @param {string} iconPath - The icon path from database
   */
  static deleteChannelIcon(iconPath) {
    return this.deleteUploadedFile(iconPath);
  }
}

module.exports = FileUtils;