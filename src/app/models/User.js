const mongoose = require("mongoose");
const schema = mongoose.Schema;

const User = new schema({
    username: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: 6,
    },
    type: {
        type: String,
        default: "website",
    },
    avatar: {
        type: String,
        default: `${process.env.SERVER_URL}/uploads/user-avatars/default-avatar.png`,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    displayName: {
        type: String,
        maxLength: 32,
        default: null
    },
    servers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Server"
    }],
},{timestamps: true});

module.exports = mongoose.model("User", User);