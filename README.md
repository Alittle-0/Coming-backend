# Coming Backend

A robust Node.js backend API for the Coming group chatting application, providing real-time messaging, server management, and user authentication services.

## 🚀 Features

- **User Authentication & Authorization**

  - JWT-based authentication
  - Google OAuth integration
  - Password encryption with bcrypt
  - Role-based access control

- **Real-time Communication**

  - Socket.IO integration for live messaging
  - Real-time notifications
  - Live server updates

- **Server Management**

  - Create, join, and manage Discord-like servers
  - Channel management within servers
  - Server member management
  - Server avatar uploads

- **Messaging System**

  - Text channel messaging
  - Message persistence
  - Message search and filtering

- **File Management**

  - User avatar uploads
  - Server avatar uploads
  - Image processing and storage
  - Secure file serving

- **API Documentation**
  - Swagger/OpenAPI documentation
  - Interactive API explorer
  - Comprehensive endpoint documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Google OAuth
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Documentation**: Swagger/OpenAPI
- **Security**: bcrypt, CORS, cookie-parser

## 📁 Project Structure

```
src/
├── app/
│   ├── controllers/     # Business logic handlers
│   ├── models/         # Database models
│   └── utils/          # Utility functions
├── bin/
│   └── www            # Server entry point
├── config/
│   ├── db/            # Database configuration
│   ├── multer.js      # File upload configuration
│   └── swagger.js     # API documentation setup
├── routes/             # API route definitions
└── public/
    └── uploads/       # File storage
```

## 🚀 Getting Started

### Demo

- **Live Application**: https://app-react-drab.vercel.app/
- **API Documentation**: https://coming-backend-production.up.railway.app/api-docs

### Prerequisites

- Node.js (>=18.0.0)
- MongoDB database
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Coming-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/coming

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # CORS Origins
   ORIGIN=http://localhost:3000,http://localhost:3001

   # Server
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication (`/user`)

- `POST /user/signup` - User registration
- `POST /user/login` - User login
- `POST /user/logout` - User logout
- `POST /user/forgot-password` - Password reset request
- `POST /user/reset-password` - Password reset

### Servers (`/server`)

- `GET /server` - Get user's servers
- `POST /server` - Create new server
- `GET /server/:id` - Get server details
- `PUT /server/:id` - Update server
- `DELETE /server/:id` - Delete server
- `POST /server/:id/join` - Join server
- `POST /server/:id/leave` - Leave server

### Channels (`/server`)

- `POST /server/:serverId/channel` - Create channel
- `GET /server/:serverId/channel` - Get server channels
- `PUT /server/:serverId/channel/:channelId` - Update channel
- `DELETE /server/:serverId/channel/:channelId` - Delete channel

### Messages (`/api/messages`)

- `GET /api/messages/:channelId` - Get channel messages
- `POST /api/messages/:channelId` - Send message
- `PUT /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message

### File Upload (`/upload`)

- `POST /upload/user-avatar` - Upload user avatar
- `POST /upload/server-avatar` - Upload server avatar

### Admin (`/admin`)

- `GET /admin/users` - Get all users (admin only)
- `PUT /admin/users/:id` - Update user (admin only)
- `DELETE /admin/users/:id` - Delete user (admin only)

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📖 API Documentation

Interactive API documentation is available at `https://coming-backend-production.up.railway.app/api-docs` when the server is running. This provides:

- Complete endpoint documentation
- Request/response examples
- Interactive testing interface
- Schema definitions

## 🗄️ Database Models

### User

- Basic profile information
- Authentication credentials
- Server memberships
- Avatar management

### Server

- Server information and settings
- Member list
- Channel list
- Avatar and customization

### Channel

- Channel metadata
- Message history
- Member permissions
- Server association

### Message

- Message content and metadata
- User and channel associations
- Timestamps and editing history

## 🔒 Security Features

- **Password Encryption**: bcrypt hashing
- **JWT Tokens**: Secure authentication
- **CORS Protection**: Configurable origin restrictions
- **Input Validation**: Request data sanitization
- **File Upload Security**: Type and size restrictions

## 🚀 Deployment

### Railway Deployment

The backend is currently deployed on Railway at `https://coming-backend-production.up.railway.app/`

### Environment Variables

Ensure all required environment variables are set in your production environment.

### Database

Use a production MongoDB instance (MongoDB Atlas recommended).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for the Coming application**
