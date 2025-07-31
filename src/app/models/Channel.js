const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Channel = new schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        minlength: 1
    },
    type: {
        type: String,
        enum: ["text", "voice"],
        default: "text"
    },
    serverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Server",
        required: true
    },
    description: {
        type: String,
        maxlength: 1024,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

Channel.index({ serverId: 1 });

module.exports = mongoose.model("Channel", Channel);