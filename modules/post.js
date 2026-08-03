const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
},
{
    timestamps: true
}
);

module.exports = mongoose.model("post", postSchema);