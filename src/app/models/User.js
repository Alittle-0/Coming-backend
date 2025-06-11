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
        required: true,
        minLength: 6,
    },
    avatar: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
},{timestamps: true});

module.exports = mongoose.model("User", User);