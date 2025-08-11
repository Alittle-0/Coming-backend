const multer = require('multer');
const path = require('path');
const fs = require('fs');

class MulterConfig {
  constructor() {
    this.baseUploadsDir = path.join(__dirname, '../../public/uploads');
    this.ensureDirectoryExists(this.baseUploadsDir);
  }

  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Generic image filter
  imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }

  // Generate unique filename
  generateUniqueFilename(prefix, originalname) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(originalname);
    return `${prefix}-${timestamp}-${randomString}${ext}`;
  }

  // Server Avatar Upload Configuration
  getServerAvatarUpload() {
    const serverAvatarDir = path.join(this.baseUploadsDir, 'server-avatars');
    this.ensureDirectoryExists(serverAvatarDir);

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, serverAvatarDir);
      },
      filename: (req, file, cb) => {
        const filename = this.generateUniqueFilename('server-avatar', file.originalname);
        cb(null, filename);
      }
    });

    return multer({
      storage: storage,
      fileFilter: this.imageFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      }
    }).single('serverAvatar');
  }

  // User Avatar Upload Configuration (for future use)
  getUserAvatarUpload() {
    const userAvatarDir = path.join(this.baseUploadsDir, 'user-avatars');
    this.ensureDirectoryExists(userAvatarDir);

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, userAvatarDir);
      },
      filename: (req, file, cb) => {
        const filename = this.generateUniqueFilename('user-avatar', file.originalname);
        cb(null, filename);
      }
    });

    return multer({
      storage: storage,
      fileFilter: this.imageFilter,
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit for user avatars
      }
    }).single('userAvatar');
  }

  // Generic file upload configuration
  getGenericFileUpload(options = {}) {
    const {
      destination = 'files',
      fieldName = 'file',
      fileSize = 10 * 1024 * 1024, // 10MB default
      allowedMimeTypes = null,
      prefix = 'file'
    } = options;

    const uploadDir = path.join(this.baseUploadsDir, destination);
    this.ensureDirectoryExists(uploadDir);

    const fileFilter = (req, file, cb) => {
      if (allowedMimeTypes && !allowedMimeTypes.includes(file.mimetype)) {
        cb(new Error(`Only ${allowedMimeTypes.join(', ')} files are allowed`), false);
      } else {
        cb(null, true);
      }
    };

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const filename = this.generateUniqueFilename(prefix, file.originalname);
        cb(null, filename);
      }
    });

    return multer({
      storage: storage,
      fileFilter: allowedMimeTypes ? fileFilter : undefined,
      limits: {
        fileSize: fileSize,
      }
    }).single(fieldName);
  }
}

module.exports = new MulterConfig();