const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Coming API",
      version: "1.0.0",
      description: "A Discord-like chat application API",
      contact: {
        name: "Coming Support",
        email: "support@coming.com",
      },
    },
    servers: [
      {
        url: "http://localhost:6001",
        description: "Development server",
      },
      {
        url: "https://coming-server.vercel.app",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            username: {
              type: "string",
              minLength: 6,
              maxLength: 20,
              description: "Username",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "User password",
            },
            avatar: {
              type: "string",
              nullable: true,
              description: "Avatar URL",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              default: "user",
            },
            displayName: {
              type: "string",
              maxLength: 32,
              nullable: true,
            },
          },
        },
        Server: {
          type: "object",
          required: ["name", "ownerId"],
          properties: {
            _id: {
              type: "string",
              description: "Server ID",
            },
            name: {
              type: "string",
              minLength: 3,
              maxLength: 100,
              description: "Server name",
            },
            description: {
              type: "string",
              maxLength: 1024,
              description: "Server description",
            },
            ownerId: {
              type: "string",
              description: "Owner user ID",
            },
            members: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  joinedAt: { type: "string", format: "date-time" },
                  nickname: { type: "string", nullable: true },
                },
              },
            },
            channels: {
              type: "array",
              items: { type: "string" },
            },
            inviteCode: {
              type: "string",
              description: "Server invite code",
            },
            isActive: {
              type: "boolean",
              default: true,
            },
          },
        },
        Channel: {
          type: "object",
          required: ["name", "type", "serverId"],
          properties: {
            _id: {
              type: "string",
              description: "Channel ID",
            },
            name: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              description: "Channel name",
            },
            type: {
              type: "string",
              enum: ["text", "voice"],
              description: "Channel type",
            },
            serverId: {
              type: "string",
              description: "Server ID",
            },
            description: {
              type: "string",
              maxLength: 1024,
              description: "Channel description",
            },
            isActive: {
              type: "boolean",
              default: true,
            },
          },
        },
        Message: {
          type: "object",
          required: ["channelId", "message", "user"],
          properties: {
            _id: {
              type: "string",
              description: "Message ID",
            },
            channelId: {
              type: "string",
              description: "Channel ID",
            },
            message: {
              type: "string",
              description: "Message content",
            },
            user: {
              type: "object",
              properties: {
                id: { type: "string" },
                username: { type: "string" },
                avatar: { type: "string", nullable: true },
              },
            },
            timestamp: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            error: {
              type: "object",
              description: "Error details (development only)",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/app/controllers/*.js"],
};

const specs = swaggerJSDoc(options);

module.exports = { swaggerUi, specs };
