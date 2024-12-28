const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    languages: [{ type: String }],
    files: {
        type: Object,
        default: {
            html: [
                {
                    fileName: "index.html",
                    content: "<h1>Hello World</h1>"
                }
            ],
            css: [
                {
                    fileName: "style.css",
                    content: "body { font-family: Arial; }"
                }
            ],
            javascript: [
                {
                    fileName: "script.js",
                    content: "console.log('Hello World');"
                }
            ]
        }
    }
});

module.exports = mongoose.model("Project", projectSchema);
