const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
    title: { type: String, default: "Untitled" },
    content: { type: String, default: "" },
    tags: [String],
    tasks: [        
        {
            text: String,
            done: { type: Boolean, default: false },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model("Page", pageSchema);
