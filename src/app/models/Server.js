const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Server = new schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        minlength: 3
    },
    description: {
        type: String,
        maxlength: 1024,
        default: ""
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        nickname: {
            type: String,
            maxlength: 32,
            default: null
        }
    }],
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    }],
    inviteCode: {
        type: String,
        unique: true,
        sparse: true
    },
    serverAvatar: {
        type: String,
        require: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

Server.index({ ownerId: 1 });
Server.index({ "members.userId": 1 });
Server.index({ inviteCode: 1 });


// Method to check if user is member
Server.methods.isMember = function(userId) {
    return this.members.some(member => member.userId.toString() === userId.toString());
};

// Method to check if user is owner
Server.methods.isOwner = function(userId) {
    return this.ownerId.toString() === userId.toString();
};

module.exports = mongoose.model("Server", Server)